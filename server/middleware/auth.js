import jwt from 'jsonwebtoken';
import ENV from '../config.js';

/** ENV.JWT_SECRET IS OUR secret or public key */

// we are only going to allow authorized users to update their values.
/** Auth middleware */
export default async function Auth(req, res, next) {
    try {
        // access authorized header to validate requests
        const token = req.headers.authorization.split(" ")[1];
        // from this token, we can retrieve user details of logged user.

        // separating text from the token.
        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);
        // now we can pass this decoded token with request
        req.user = decodedToken;

        // res.json(decodedToken);
        next();
    } catch (error) {
        res.status(401).send({ error: "Authentication failed!" });
    }
}


export function localVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next()
}