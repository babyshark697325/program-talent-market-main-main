import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const dryRun = process.env.RESEND_DRY_RUN === "1";

  if (!apiKey && !dryRun) {
    return res.status(500).json({ error: "RESEND_API_KEY not configured" });
  }

  const resend = dryRun ? null : new Resend(apiKey);

  try {
    const { to, subject, html, text, from } = req.body || {};
    if (!to || !subject || (!html && !text)) {
      return res
        .status(400)
        .json({ error: "Missing required fields: to, subject, and html or text" });
    }

    // ✅ Always use your verified sender
    const sender = from || process.env.RESEND_FROM || "noreply@myvillagetalent.com";

    // 🔹 Dry-run mode (simulates send without calling API)
    if (dryRun) {
      console.log("Dry-run email send:", { to, subject, html, text, from: sender });
      return res.status(200).json({ success: true, id: "dry_run_id" });
    }

    // 🔹 Real send
    const result = await resend.emails.send({
      from: sender,
      to,
      subject,
      ...(html ? { html } : {}),
      ...(text ? { text } : {}),
    });

    console.log("Resend response:", result);

    return res.status(200).json({
      success: true,
      id: result?.id || result?.data?.id || null,
    });
  } catch (err) {
    console.error("Resend send-email error:", err);
    const message = err?.message || "Unknown error";
    return res.status(500).json({ error: message });
  }
}
