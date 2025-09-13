import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const dryRun = process.env.RESEND_DRY_RUN === "1";
  const isDev = process.env.NODE_ENV !== "production";

  if (!apiKey && !dryRun) {
    return res.status(500).json({ error: "RESEND_API_KEY not configured" });
  }

  const resend = dryRun ? null : new Resend(apiKey);

  try {
    const { to, subject, html, text } = req.body || {};
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({
        error: "Missing required fields: to, subject, and html or text",
      });
    }

    // ✅ Always force noreply@myvillagetalent.com
    const sender = "noreply@myvillagetalent.com";

    // ✅ In dev, redirect to test inbox
    const recipient = isDev ? "artist2819@gmail.com" : to;

    // 🔹 Dry-run mode (simulate send without API call)
    if (dryRun) {
      console.log("Dry-run email send:", {
        recipient,
        subject,
        html,
        text,
        from: sender,
      });
      return res.status(200).json({ success: true, id: "dry_run_id" });
    }

    // 🔹 Real send
    const result = await resend.emails.send({
      from: sender,
      to: recipient,
      subject,
      ...(html ? { html } : {}),
      ...(text ? { text } : {}),
    });

    console.log("Resend response:", result);

    return res.status(200).json({
      success: true,
      id: result?.id || result?.data?.id || null,
      ...(isDev ? { raw: result } : {}),
    });
  } catch (err) {
    console.error("Resend send-email error:", err);
    const message = err?.message || "Unknown error";
    return res.status(500).json({ error: message });
  }
}
