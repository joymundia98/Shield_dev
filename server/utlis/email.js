import * as ResendLib from "resend"; // import everything
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Instantiate Resend using the named export
const resend = new ResendLib.Resend(process.env.RESEND_API_KEY);

export const SendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY not set");
  }

  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL, // make sure this is set in .env
      to,
      subject,
      html,
    });

    console.log("Email sent:", response);
    return response;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};
