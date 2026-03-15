import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PW,
            },
        });

        const emailHtml = await render(VerificationEmail({ username, otp: verifyCode }));

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: 'Anonymous Message Platform | Verification Code',
            html: emailHtml,
        };

        await transporter.sendMail(mailOptions);

        return { success: true, message: "Verification email sent successfully", isAcceptingMessage: false };

    } catch (emailError) {
        console.error("Error sending verification email ", emailError);
        return { success: false, message: "Failed to send Verification email", isAcceptingMessage: false };
    }
}