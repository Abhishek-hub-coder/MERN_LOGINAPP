import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';
import ENV from '../config.js'; // Ensure this file exports EMAIL and PASSWORD

// Configure node mailer
let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: ENV.EMAIL,  // Use the environment variable correctly
        pass: ENV.PASSWORD, // Use the environment variable correctly
    },
};

// Create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(nodeConfig);

// Create a Mailgen object
let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        // Appears in header & footer of e-mails
        name: 'Mailgen',
        link: 'https://mailgen.js/'
    }
});



const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    // body of the email
    var email = {
        body: {
            name: username,
            intro: text || 'Welcome! I\'a  very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, I\'d love to help.'
        }
    };

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody
    };

    try {
        // send mail
        await transporter.sendMail(message);
        return res.status(200).send({ msg: "You should receive an email from us." });
    } catch (error) {
        return res.status(500).send({ error });
    }
};

export default registerMail;
