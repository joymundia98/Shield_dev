// email.js
import { Resend } from "resend";

let resendInstance = null;

// Lazy-load Resend instance
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("❌ RESEND_API_KEY is missing. Ensure dotenv.config() runs in server.js");
  }

  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
};

export const SendEmail = async ({ to, subject, html }) => {
  console.log("📨 Sending email to:", to);

  return getResend().emails.send({
    from: "no-reply@sci-eld.org",
    to,
    subject,
    html,
  });
};
