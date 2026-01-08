import { SendEmail } from "./email.js";

(async () => {
  try {
    const response = await SendEmail({
      to: "kayzy.c@gmail.com",  // <-- replace with your email
      subject: "Test Email from Resend",
      html: "<h1>Hello!</h1><p>This is a test email from Resend.</p>",
    });
    console.log("Test email sent successfully!", response);
  } catch (err) {
    console.error("Test email failed:", err);
  }
})();
