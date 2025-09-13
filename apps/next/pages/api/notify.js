import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, type, jobTitle } = req.body;

  let subject = '';
  let message = '';

  if (type === 'application') {
    subject = 'New Application Received';
    message = `Someone applied to your job: ${jobTitle}`;
  } else if (type === 'accepted') {
    subject = 'Your Application was Accepted 🎉';
    message = `Congrats! Your application for ${jobTitle} was accepted.`;
  } else {
    subject = 'Notification';
    message = `You have a new notification about ${jobTitle}`;
  }

  try {
    await resend.emails.send({
      from: 'noreply@yourdomain.com', // replace with your verified sender in Resend
      to,
      subject,
      html: `<p>${message}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: err.message });
  }
}
