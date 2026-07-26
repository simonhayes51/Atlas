// Submission notification emails via the Resend HTTP API.
// Plain fetch keeps the dependency list short; the API is stable.
// If RESEND_API_KEY is unset, notifications are silently skipped —
// submissions are still stored.

export async function sendSubmissionEmail(opts: {
  to: string;
  formName: string;
  formId: string;
  data: Record<string, string>;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const rows = Object.entries(opts.data)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;">${escapeHtml(key)}</td><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:560px;">
      <h2 style="margin:0 0 4px;">New submission: ${escapeHtml(opts.formName)}</h2>
      <p style="color:#666;margin:0 0 16px;">via FormSink form <code>${opts.formId}</code></p>
      <table style="border-collapse:collapse;">${rows}</table>
    </div>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "FormSink <notifications@example.com>",
        to: [opts.to],
        subject: `New submission — ${opts.formName}`,
        html,
      }),
    });
  } catch {
    // Never let a notification failure break submission handling.
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
