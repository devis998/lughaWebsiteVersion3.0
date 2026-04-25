import InnerPageLayout from '../components/InnerPageLayout';

export default function CookiePolicyPage() {
  return (
    <InnerPageLayout title="Cookie Policy" subtitle="How cookies and similar technologies are used on this website.">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">What Are Cookies</h2>
        <p>
          Cookies are small text files stored on your device that help websites operate effectively and provide insights
          into usage and performance.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">How We Use Cookies</h2>
        <p>
          We may use cookies or similar technologies for essential website functionality, analytics, and security controls.
          Security-related systems may also use anti-bot or anti-abuse checks.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Managing Cookies</h2>
        <p>
          You can control cookies through your browser settings, including blocking or deleting existing cookies. Disabling
          certain cookies may impact website functionality.
        </p>
      </section>
    </InnerPageLayout>
  );
}
