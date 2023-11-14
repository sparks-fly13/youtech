const nodemailer = require('nodemailer');

const client = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendEmail(to) {
    try {
        await client.sendMail({
            text: "I hope this message finds you well. Your video has been approved and uploaded to YouTube.",
            from: process.env.EMAIL_USER,
            to,
            subject: "Video approved and uploaded"
        });
    } catch (err) {
        console.error(err);
        throw new Error('Failed to send email');
    }
}

module.exports = {sendEmail};