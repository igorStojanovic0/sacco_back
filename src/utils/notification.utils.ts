import nodemailer from 'nodemailer';

// Email
export const sendEmail = (recipient: string, subject: string, body: string) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: `"Twezimbe" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};
// Notification


// OTP
/**
 * Generate an OTP with a given validity period.
 * @returns an object containing the OTP and its expiry date
 */
export const GenerateOTP = (): { otp: number, expiryDate: Date} => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiryDate = new Date(new Date().getTime() + (30 * 60 * 1000));

    return { otp, expiryDate };
};