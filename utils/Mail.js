import nodemailer from "nodemailer";

// Gmail Transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Send Email Function
export const sendWelcomeEmail = async (to, subject, html) => {
    try {
        // Email options
        const mailOptions = {
            from: `"Playmate" <${process.env.EMAIL}>`,
            to,
            subject,
            html,
        };

        // Send email
        const result = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent:", result.messageId);

        return result;

    } catch (error) {
        console.error("Email sending failed:", error);
        // throw new Error("Email could not be sent");
    }
};

export const sendEmail = async (to, subject, html) => {
    try {
        // Email options
        const mailOptions = {
            from: `"Playmate" <${process.env.EMAIL}>`,
            to,
            subject,
            html,
        };

        // Send email
        const result = await transporter.sendMail(mailOptions);
        console.log("Email sent:", result.messageId);
        return result;

    }
    catch (error) {
        console.error("Email sending failed:", error);
        // throw new Error("Email could not be sent");
    }
};