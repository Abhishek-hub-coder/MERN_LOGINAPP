
import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator';




//creating controller for all the routes

// creating middleware
export async function verifyUser(req, res, next) {
    try {

        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "Can't find User!" });
        // if there is user inside the mongodb database, it is going to move to the next controller.
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
    }
}




export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        // Check for existing username
        const existingUsername = await UserModel.findOne({ username }).exec();
        if (existingUsername) {
            return res.status(400).send({ error: "Please use a unique username" });
        }

        // Check for existing email
        const existingEmail = await UserModel.findOne({ email }).exec();
        if (existingEmail) {
            return res.status(400).send({ error: "Please use a unique email" });
        }

        if (!password) {
            return res.status(400).send({ error: "Password is required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
            username,
            password: hashedPassword,
            profile: profile || '',
            email
        });

        const result = await user.save();
        return res.status(201).send({ msg: "User registered successfully" });

    } catch (error) {
        console.error('Registration error:', error);  // Logging the error for debugging
        const errorMessage = error.error || error.message || 'An error occurred during registration';
        return res.status(500).send({ error: errorMessage });
    }
}




export async function login(req, res) {

    const { username, password } = req.body;

    try {

        UserModel.findOne({ username })
            .then(user => {
                // second one is the password from database.
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if (!passwordCheck) return res.status(400).send({ error: "Please put password" });

                        // create jwt token

                        const token = jwt.sign({
                            userId: user._id,
                            username: user.username
                        }, ENV.JWT_SECRET, { expiresIn: "24h" });

                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });

                    })
                    .catch(error => {
                        return res.status(400).send({ error: "Password does not Match" })
                    })
            })
            .catch(error => {
                return res.status(404).send({ error: "Username not Found" });
            })

    } catch (error) {
        return res.status(500).send({ error });
    }
}

export async function getUser(req, res) {
    const { username } = req.params;
    try {

        if (!username) {
            return res.status(501).send({ error: "Invalid Username" });
        }


        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(501).send({ error: "Could not find the user" });
        }


        const { password, ...rest } = Object.assign({}, user.toJSON());

        return res.status(201).send(rest);

    } catch (error) {
        return res.status(404).send({ error: "Cannot find User Data" });
    }
}




// Server-side generateOTP function
export async function generateOTP(req, res) {
    try {
        req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        console.log(`Generated OTP: ${req.app.locals.OTP} for ${req.query.username}`);
        res.status(201).send({
            code: req.app.locals.OTP
        });
    } catch (error) {
        res.status(500).send({ error: 'Error generating OTP' });
    }
}




export async function verifyOTP(req, res) {
    const { code } = req.query;
    const storedOTP = req.app.locals.OTP;
    // console.log(`Verifying OTP: ${code}, Stored OTP: ${storedOTP}`);
    if (parseInt(storedOTP) === parseInt(code)) {
        req.app.locals.OTP = null; // reset the OTP value.
        // reset the opv value. 
        //  start session
        req.app.locals.resetSession = true; // start the sessin for reset password;
        return res.status(201).send({ msg: "verified successfully" });
    }
    // If otp not matching or user is giving invalid otp
    return res.status(400).send({
        error: "Invalid OTP"
    })
}





export async function updateUser(req, res) {
    try {

        const { userId } = req.user;


        if (userId) {

            const body = req.body;


            const result = await UserModel.updateOne({ _id: userId }, body);

            // Check if any documents were modified
            if (result.modifiedCount === 0) {
                return res.status(404).send({ error: "No record updated" });
            }



            return res.status(201).send({ msg: "Record updated...!" });
        } else {

            return res.status(401).send({ error: "User not found" });
        }
    } catch (error) {
        return res.status(401).send({ error });
    }
}



/** this is used to successfully redirect the user , when otp is invalid */
/** it is going to redirect the user to reset password only, when otp is valid */
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false;
        // allow access to this route only once

        return res.status(201).send({ flag: req.app.locals.resetSession });
    }
    // only allow the user to access the route once when the user try to reset the password.

    return res.status(440).send({ error: "Session expired" });
}



export async function resetPassword(req, res) {

    try {
        // first check if we have valid session, only then we can update the password, ohterwise session is expired

        // if (!req.app.locals.resetSession)
        //     return res.status(440).send({ error: "Session expired" });


        const { username, password } = req.body;

        // Check if username and password are provided
        if (!username || !password) {
            return res.status(400).send({ error: "Username and password are required" });
        }

        try {
            // Find the user by username
            const user = await UserModel.findOne({ username });

            if (!user) {
                return res.status(404).send({ error: "Username not found" });
            }

            try {
                // Hash the new password
                const hashedPassword = await bcrypt.hash(password, 10);

                try {
                    // Update the user's password
                    const result = await UserModel.updateOne({ username: user.username }, { password: hashedPassword });

                    if (result.modifiedCount === 0) {
                        return res.status(500).send({ error: "Failed to update password" });
                    }
                    // when true specify false.
                    req.app.locals.resetSession = false;
                    return res.status(201).send({ msg: "Record Updated!..." });
                } catch (updateError) {
                    return res.status(500).send({ error: "An error occurred while updating the password", details: updateError.message });
                }
            } catch (hashError) {
                return res.status(500).send({ error: "Failed to hash password", details: hashError.message });
            }
        } catch (findUserError) {
            return res.status(500).send({ error: "An error occurred while finding the user", details: findUserError.message });
        }
    } catch (error) {
        return res.status(500).send({ error: "An unexpected error occurred", details: error.message });
    }
}








