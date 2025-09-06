// utils/notifications.js
import sgMail from "@sendgrid/mail";

// Load SendGrid API Key from .env.local
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send an email notification
 * @param {string} to - recipient email
 * @param {string} subject - subject line
 * @param {string} body - plain text or HTML body
 */
export async function sendNotificationEmail(to, subject, body) {
  const msg = {
    to,
    from: "no-reply@yourdomain.com", // must be a verified sender in SendGrid
    subject,
    text: body,
    html: `<p>${body}</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
    return { success: true };
  } catch (err) {
    console.error("❌ Error sending email:", err.response?.body || err.message);
    return { success: false, error: err };
  }
}

