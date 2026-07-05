import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

// The "from" address — must be a verified domain or use Resend's onboarding address
const FROM_ADDRESS = process.env.RESEND_FROM || "FXElite Pro <onboarding@resend.dev>";

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️  RESEND_API_KEY not set. Logging email to console instead:");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
    } else {
      console.log("Email sent via Resend, id:", data?.id);
    }
  } catch (err) {
    console.error("Resend exception:", err);
  }
}
