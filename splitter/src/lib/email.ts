
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(args: EmailArgs) {
  try {
    const result = await resend.emails.send({
      from: "Splitr <onboarding@resend.dev>",
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
    });

   // console.log("Email sent successfully:", result);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: (error as Error).message };
  }
}
