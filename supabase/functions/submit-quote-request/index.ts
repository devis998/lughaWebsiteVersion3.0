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

    const body: QuoteRequest = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

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
            to: ["getlugha@gmail.com"],
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

    return new Response(
      JSON.stringify({
        success: true,
        message: "Quote request submitted successfully",
        id: data?.id,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
