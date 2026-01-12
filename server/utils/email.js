import { Resend } from "resend";

// ⚠️ TEMPORARY DEBUG ONLY — REMOVE AFTER TEST
const HARDCODED_RESEND_KEY = "re_4dzRYU9U_KSd44nh6sYJK9ywbTDqu9KoF";

const resend = new Resend(HARDCODED_RESEND_KEY);

export const SendEmail = async ({ to, subject, html }) => {
  console.log("📨 Sending email to:", to);

  const response = await resend.emails.send({
    from: "support@sci-eld.org",
    to,
    subject,
    html,
  });

  console.log("📬 Resend response:", response);
  return response;
};
