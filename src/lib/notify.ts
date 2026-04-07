/**
 * notify.ts
 * Sends email notifications to the site owner via Web3Forms.
 * Web3Forms is free, works directly from the browser — no backend needed.
 * Sign up at https://web3forms.com and enter getlugha@gmail.com to get an access key.
 * Add VITE_WEB3FORMS_KEY to your .env file.
 */

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

/** Fire-and-forget: never throws, logs warnings only */
async function sendNotification(payload: Record<string, unknown>): Promise<void> {
  if (!ACCESS_KEY) {
    console.warn('[notify] VITE_WEB3FORMS_KEY not set — email notification skipped.');
    return;
  }
  try {
    const res = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: ACCESS_KEY, ...payload }),
    });
    const json = await res.json();
    if (json.success) {
      console.log('[notify] Email notification sent ✓');
    } else {
      console.warn('[notify] Web3Forms error:', json.message);
    }
  } catch (err) {
    console.warn('[notify] Email notification failed (non-critical):', err);
  }
}

/** Notify owner about a new quote request */
export function notifyQuoteRequest(data: {
  name: string;
  email: string;
  phone: string;
  category: string;
  wordCount: string;
  sourceLanguage: string;
  targetLanguages: string[];
  urgency: string;
  message: string;
}) {
  const urgencyLabel: Record<string, string> = {
    standard: 'Standard (7–10 days)',
    expedited: 'Expedited (3–5 days)',
    rush: 'Rush (24–48 hours)',
  };

  sendNotification({
    subject: `📋 New Quote Request — ${data.category} Package from ${data.name}`,
    from_name: `Lugha Website (${data.name})`,
    // Web3Forms will email these fields to getlugha@gmail.com
    'Client Name': data.name,
    'Client Email': data.email,
    'Client Phone': data.phone,
    'Package': data.category,
    'Word Count': data.wordCount,
    'Source Language': data.sourceLanguage,
    'Target Languages': data.targetLanguages.join(', '),
    'Urgency': urgencyLabel[data.urgency] || data.urgency,
    'Additional Notes': data.message || '—',
    // Redirect email reply-to to the client
    replyto: data.email,
  });
}

/** Notify owner about a new contact inquiry */
export function notifyContactInquiry(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  const subjectLabels: Record<string, string> = {
    quote: 'Quote Inquiry',
    support: 'Support Request',
    partnership: 'Partnership Opportunity',
    other: 'Other',
  };

  sendNotification({
    subject: `💬 New Contact Inquiry — ${subjectLabels[data.subject] || data.subject} from ${data.name}`,
    from_name: `Lugha Website (${data.name})`,
    'From': data.name,
    'Email': data.email,
    'Phone': data.phone,
    'Subject': subjectLabels[data.subject] || data.subject,
    'Message': data.message,
    replyto: data.email,
  });
}
