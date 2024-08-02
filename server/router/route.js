import { Router } from 'express';
import Auth, { localVariables } from '../middleware/auth.js';
import registerMail from '../controllers/mailer.js';
const router = Router();

/** importing all the controllers */
import * as controller from '../controllers/appController.js';

/** POST Method */
router.route('/register').post(controller.register);

// whenever we have successfully registered inside the application, make register mail request and sevd an email to email address
router.route('/registerMail').post(registerMail);// send the email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end());// authenticate user client but before we call response.end first verify the user


// authenticate the user
// it is going to first verify the user and then goes to login route.
router.route('/login').post(controller.verifyUser, controller.login); // login in the app

/** GET method */
router.route('/user/:username').get(controller.getUser); // getting user with the username
// I also want to verify the user before we generate OTP.
// first verify the user, then create variables and then access the variables inside the generated OTP.
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP); // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) // verify generated otp
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables

/** PUT method */
router.route('/updateuser').put(Auth, controller.updateUser); // used to update the user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // used to reset password

export default router;
