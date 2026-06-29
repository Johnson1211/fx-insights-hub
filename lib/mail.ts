import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  // If credentials are not configured, print to log for dev convenience
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("Mail warning: SMTP credentials not set. Logging email content instead:");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for 587/others
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"FXElite Pro Notifications" <${SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Nodemailer error sending email:", error);
    // Do not throw to avoid crashing requests
  }
}
