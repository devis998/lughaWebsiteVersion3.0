import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const URGENCY_LABELS: Record<string, string> = {
  standard: "Standard (7–10 days)",
  expedited: "Expedited (3–5 days)",
  rush: "Rush (24–48 hours)",
};

interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  urgency?: string;
  source_language: string;
  target_languages: string[];
  message?: string;
  turnstileToken: string;
}

const LIMITS = {
  ipPerMinute: 5,
  emailPerMinute: 1,
  emailIpPerTenMinutes: 3,
  nameMax: 100,
  emailMax: 254,
  phoneMax: 30,
  categoryMax: 40,
  descriptionMax: 500,
  sourceLanguageMax: 50,
  targetLanguagesMax: 10,
  messageMax: 3000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const PHONE_RE = /^[0-9+\-() ]{5,30}$/;
const SUSPICIOUS_RE = /<\s*script|<\s*iframe|on\w+\s*=|javascript:|data:text\/html|%3cscript/i;
const URL_RE = /https?:\/\/|www\./i;
const CATEGORY_ALLOWLIST = new Set(["Basic", "Professional", "Enterprise"]);
const URGENCY_ALLOWLIST = new Set(["standard", "expedited", "rush"]);
const LANGUAGE_ALLOWLIST = new Set(["English", "Spanish", "French", "German", "Chinese", "Arabic", "Japanese", "Portuguese"]);

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

function validateQuotePayload(raw: unknown): { ok: true; data: QuoteRequest } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Invalid payload" };
  }

  const body = raw as Record<string, unknown>;
  const name = normalizeText(body.name);
  const email = normalizeText(body.email).toLowerCase();
  const phone = normalizeText(body.phone);
  const category = normalizeText(body.category);
  const description = normalizeText(body.description);
  const urgency = normalizeText(body.urgency || "standard").toLowerCase();
  const source_language = normalizeText(body.source_language);
  const message = normalizeText(body.message);
  const turnstileToken = normalizeText(body.turnstileToken);

  const rawTargets = Array.isArray(body.target_languages) ? body.target_languages : [];
  const target_languages = rawTargets.map(normalizeText).filter(Boolean);

  if (!name || name.length > LIMITS.nameMax || hasSuspiciousContent(name) || URL_RE.test(name)) {
    return { ok: false, error: "Invalid name" };
  }
  if (!email || email.length > LIMITS.emailMax || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Invalid email" };
  }
  if (!phone || phone.length > LIMITS.phoneMax || !PHONE_RE.test(phone)) {
    return { ok: false, error: "Invalid phone number" };
  }
  if (!category || category.length > LIMITS.categoryMax || !CATEGORY_ALLOWLIST.has(category)) {
    return { ok: false, error: "Invalid package category" };
  }
  if (!description || description.length > LIMITS.descriptionMax || hasSuspiciousContent(description) || URL_RE.test(description)) {
    return { ok: false, error: "Invalid project description" };
  }
  if (!URGENCY_ALLOWLIST.has(urgency)) {
    return { ok: false, error: "Invalid urgency" };
  }
  if (!source_language || source_language.length > LIMITS.sourceLanguageMax || !LANGUAGE_ALLOWLIST.has(source_language)) {
    return { ok: false, error: "Invalid source language" };
  }
  if (
    target_languages.length === 0 ||
    target_languages.length > LIMITS.targetLanguagesMax ||
    target_languages.some((lang) => !LANGUAGE_ALLOWLIST.has(lang))
  ) {
    return { ok: false, error: "Invalid target languages" };
  }
  if (message.length > LIMITS.messageMax || hasSuspiciousContent(message) || URL_RE.test(message)) {
    return { ok: false, error: "Invalid additional message" };
  }
  if (!turnstileToken) {
    return { ok: false, error: "Missing CAPTCHA token" };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      category,
      description,
      urgency,
      source_language,
      target_languages,
      message,
      turnstileToken,
    },
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

function buildQuoteEmailHtml(body: QuoteRequest): string {
  const urgency = URGENCY_LABELS[body.urgency ?? "standard"] ?? body.urgency;
  const langTags = body.target_languages
    .map((l) => `<span style="background:#f0fdfa;color:#0f766e;padding:3px 10px;border-radius:999px;font-size:13px;margin:2px;display:inline-block">${l}</span>`)
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px">
  <div style="background:white;border-radius:10px;padding:32px;max-width:600px;margin:auto;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:linear-gradient(135deg,#4A4E9E,#3d4182);padding:20px 24px;border-radius:8px;margin-bottom:24px">
      <h1 style="color:white;margin:0;font-size:20px">📋 New Quote Request</h1>
      <p style="color:rgba(255,255,255,.85);margin:4px 0 0;font-size:14px">A new client has requested a translation quote via the Lugha website.</p>
    </div>
    <span style="background:#eef0ff;color:#4A4E9E;padding:4px 12px;border-radius:999px;font-size:13px;font-weight:600">${body.category} Package</span>
    <table style="width:100%;margin-top:20px;border-collapse:collapse">
      <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase">Client Name</td><td style="padding:8px 0;font-size:15px;font-weight:500">${body.name}</td></tr>
      <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase">Email</td><td style="padding:8px 0"><a href="mailto:${body.email}" style="color:#4A4E9E">${body.email}</a></td></tr>
      <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase">Phone</td><td style="padding:8px 0"><a href="tel:${body.phone}" style="color:#4A4E9E">${body.phone}</a></td></tr>
      <tr><td colspan="2"><hr style="border:none;border-top:1px solid #eee;margin:12px 0"/></td></tr>
      <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase">Project Details</td><td style="padding:8px 0;font-size:15px">${body.description}</td></tr>
      <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase">Source Language</td><td style="padding:8px 0;font-size:15px;font-weight:500">${body.source_language}</td></tr>
      <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase;vertical-align:top">Target Languages</td><td style="padding:8px 0">${langTags}</td></tr>
      <tr><td style="padding:8px 0;color:#888;font-size:12px;text-transform:uppercase">Urgency</td><td style="padding:8px 0;font-size:15px;font-weight:500">${urgency}</td></tr>
    </table>
    ${body.message ? `<div style="margin-top:16px"><div style="color:#888;font-size:12px;text-transform:uppercase;margin-bottom:6px">Additional Notes</div><div style="background:#f9f9f9;border-left:3px solid #4A4E9E;padding:12px 16px;border-radius:0 6px 6px 0;font-size:14px;color:#444">${body.message}</div></div>` : ""}
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

    const validation = validateQuotePayload(await req.json());
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

    const ipThrottle = await enforceThrottle(supabase, `quote:ip:${clientIp}`, 60, LIMITS.ipPerMinute);
    if (!ipThrottle.allowed) {
      return jsonResponse(429, {
        success: false,
        error: "Too many requests. Please try again shortly.",
        retryAfterSeconds: ipThrottle.retryAfterSeconds,
      });
    }

    const emailThrottle = await enforceThrottle(supabase, `quote:email:${body.email}`, 60, LIMITS.emailPerMinute);
    if (!emailThrottle.allowed) {
      return jsonResponse(429, {
        success: false,
        error: "Please wait before submitting again.",
        retryAfterSeconds: emailThrottle.retryAfterSeconds,
      });
    }

    const emailIpThrottle = await enforceThrottle(
      supabase,
      `quote:email-ip:${body.email}:${clientIp}`,
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
      .from("quote_requests")
      .insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
          category: body.category,
          description: body.description,
          urgency: body.urgency || "standard",
          source_language: body.source_language,
          target_languages: body.target_languages,
          message: body.message || null,
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
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Lugha Notifications <onboarding@resend.dev>",
            to: getResendRecipients(),
            reply_to: body.email,
            subject: `📋 New Quote Request — ${body.category} Package from ${body.name}`,
            html: buildQuoteEmailHtml(body),
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
    // ─────────────────────────────────────────────────────────────────────

    return jsonResponse(200, {
      success: true,
      message: "Quote request submitted successfully",
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
