import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUBJECT_LABELS: Record<string, string> = {
  quote: "Quote Inquiry",
  support: "Support Request",
  partnership: "Partnership Opportunity",
  other: "Other",
};

interface ContactInquiry {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  turnstileToken: string;
}

const LIMITS = {
  ipPerMinute: 5,
  emailPerMinute: 1,
  emailIpPerTenMinutes: 3,
  nameMax: 100,
  emailMax: 254,
  phoneMax: 30,
  subjectMax: 40,
  messageMax: 3000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const PHONE_RE = /^[0-9+\-() ]{5,30}$/;
const SUSPICIOUS_RE = /<\s*script|<\s*iframe|on\w+\s*=|javascript:|data:text\/html|%3cscript/i;
const URL_RE = /https?:\/\/|www\./i;

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function normalizeText(value: unknown): string {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function hasSuspiciousContent(value: string): boolean {
  return SUSPICIOUS_RE.test(value);
}

function validateContactPayload(raw: unknown): { ok: true; data: ContactInquiry } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Invalid payload" };
  }

  const body = raw as Record<string, unknown>;
  const name = normalizeText(body.name);
  const email = normalizeText(body.email).toLowerCase();
  const phone = normalizeText(body.phone);
  const subject = normalizeText(body.subject).toLowerCase();
  const message = normalizeText(body.message);
  const turnstileToken = normalizeText(body.turnstileToken);

  if (!name || name.length > LIMITS.nameMax || hasSuspiciousContent(name) || URL_RE.test(name)) {
    return { ok: false, error: "Invalid name" };
  }
  if (!email || email.length > LIMITS.emailMax || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Invalid email" };
  }
  if (!phone || phone.length > LIMITS.phoneMax || !PHONE_RE.test(phone)) {
    return { ok: false, error: "Invalid phone number" };
  }
  if (!subject || subject.length > LIMITS.subjectMax || !(subject in SUBJECT_LABELS)) {
    return { ok: false, error: "Invalid subject" };
  }
  if (!message || message.length > LIMITS.messageMax || hasSuspiciousContent(message) || URL_RE.test(message)) {
    return { ok: false, error: "Invalid message" };
  }
  if (!turnstileToken) {
    return { ok: false, error: "Missing CAPTCHA token" };
  }

  return {
    ok: true,
    data: { name, email, phone, subject, message, turnstileToken },
  };
}

async function enforceThrottle(
  supabase: ReturnType<typeof createClient>,
  key: string,
  windowSeconds: number,
  maxRequests: number
) {
  const { data, error } = await supabase.rpc("consume_throttle", {
    p_key: key,
    p_window_seconds: windowSeconds,
    p_max_requests: maxRequests,
    p_increment: 1,
  });

  if (error) throw new Error("Throttle check failed");

  const row = Array.isArray(data) ? data[0] : null;
  if (!row || row.allowed !== true) {
    const resetAt = row?.reset_at ? Date.parse(String(row.reset_at)) : Date.now() + windowSeconds * 1000;
    const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) throw new Error("CAPTCHA secret not configured");

  const form = new URLSearchParams();
  form.append("secret", secret);
  form.append("response", token);
  if (ip && ip !== "unknown") form.append("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!res.ok) return false;
  const json = await res.json();
  return json?.success === true;
}

function buildContactEmailHtml(body: ContactInquiry): string {
  const subjectLabel = SUBJECT_LABELS[body.subject] ?? body.subject;
  const replyUrl = `mailto:${body.email}?subject=${encodeURIComponent(`Re: ${subjectLabel}`)}`;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px">
  <div style="background:white;border-radius:10px;padding:32px;max-width:600px;margin:auto;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:linear-gradient(135deg,#14b8a6,#0d9488);padding:20px 24px;border-radius:8px;margin-bottom:24px">
      <h1 style="color:white;margin:0;font-size:20px">💬 New Contact Inquiry</h1>
      <p style="color:rgba(255,255,255,.85);margin:4px 0 0;font-size:14px">Someone has reached out via the Lugha website contact form.</p>
    </div>
    <span style="background:#f0fdfa;color:#0f766e;padding:4px 12px;border-radius:999px;font-size:13px;font-weight:600">${subjectLabel}</span>
    <table style="width:100%;margin-top:20px;border-collapse:collapse">
      <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase">From</td><td style="padding:8px 0;font-size:15px;font-weight:500">${body.name}</td></tr>
      <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase">Email</td><td style="padding:8px 0"><a href="mailto:${body.email}" style="color:#0d9488">${body.email}</a></td></tr>
      <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase">Phone</td><td style="padding:8px 0"><a href="tel:${body.phone}" style="color:#0d9488">${body.phone}</a></td></tr>
    </table>
    <div style="margin-top:20px">
      <div style="color:#888;font-size:12px;text-transform:uppercase;margin-bottom:6px">Message</div>
      <div style="background:#f9f9f9;border-left:3px solid #14b8a6;padding:12px 16px;border-radius:0 6px 6px 0;font-size:14px;color:#444;line-height:1.6;white-space:pre-wrap">${body.message}</div>
    </div>
    <div style="margin-top:20px">
      <a href="${replyUrl}" style="display:inline-block;padding:10px 24px;background:#14b8a6;color:white;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px">Reply to ${body.name}</a>
    </div>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
    <div style="text-align:center;color:#aaa;font-size:12px">Lugha Translation Services &bull; getlugha@gmail.com &bull; +255 744 381 263</div>
  </div>
</body></html>`;
}

function getResendRecipients(): string[] {
  const configured = Deno.env.get("RESEND_TO_EMAIL")?.trim();
  if (!configured) return ["getlugha@gmail.com"];
  return configured
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const validation = validateContactPayload(await req.json());
    if (!validation.ok) {
      return jsonResponse(400, { success: false, error: validation.error });
    }
    const body = validation.data;
    const clientIp = getClientIp(req);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const ipThrottle = await enforceThrottle(supabase, `contact:ip:${clientIp}`, 60, LIMITS.ipPerMinute);
    if (!ipThrottle.allowed) {
      return jsonResponse(429, {
        success: false,
        error: "Too many requests. Please try again shortly.",
        retryAfterSeconds: ipThrottle.retryAfterSeconds,
      });
    }

    const emailThrottle = await enforceThrottle(supabase, `contact:email:${body.email}`, 60, LIMITS.emailPerMinute);
    if (!emailThrottle.allowed) {
      return jsonResponse(429, {
        success: false,
        error: "Please wait before submitting again.",
        retryAfterSeconds: emailThrottle.retryAfterSeconds,
      });
    }

    const emailIpThrottle = await enforceThrottle(
      supabase,
      `contact:email-ip:${body.email}:${clientIp}`,
      600,
      LIMITS.emailIpPerTenMinutes
    );
    if (!emailIpThrottle.allowed) {
      return jsonResponse(429, {
        success: false,
        error: "Too many repeated submissions from this source.",
        retryAfterSeconds: emailIpThrottle.retryAfterSeconds,
      });
    }

    const captchaOk = await verifyTurnstile(body.turnstileToken, clientIp);
    if (!captchaOk) {
      return jsonResponse(403, { success: false, error: "CAPTCHA verification failed" });
    }

    const { data, error } = await supabase
      .from("contact_inquiries")
      .insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
          subject: body.subject,
          message: body.message,
          status: "pending",
        },
      ])
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    // ── Send email notification (non-critical) ───────────────────────────
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      try {
        const subjectLabel = SUBJECT_LABELS[body.subject] ?? body.subject;
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Lugha Notifications <notifications@getlugha.com>",
            to: getResendRecipients(),
            reply_to: body.email,
            subject: `💬 New Contact Inquiry — ${subjectLabel} from ${body.name}`,
            html: buildContactEmailHtml(body),
          }),
        });
        if (!emailRes.ok) {
          const errText = await emailRes.text();
          console.warn(`Resend warning (${emailRes.status}): ${errText}`);
        } else {
          const emailJson = await emailRes.json();
          console.log("Email sent, id:", emailJson.id);
        }
      } catch (emailErr) {
        console.warn("Email send failed (non-critical):", emailErr);
      }
    } else {
      console.warn("RESEND_API_KEY not set — skipping email notification");
    }
    // ────────────────────────────────────────────────────────────────────

    return jsonResponse(200, {
      success: true,
      message: "Contact inquiry submitted successfully",
      id: data?.id,
    });
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(500, {
      success: false,
      error: "Request failed. Please try again later.",
    });
  }
});
