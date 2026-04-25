import InnerPageLayout from '../components/InnerPageLayout';

export default function PrivacyPolicyPage() {
  return (
    <InnerPageLayout title="Privacy Policy" subtitle="How Lugha collects, uses, and protects your information.">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Information We Collect</h2>
        <p>
          We collect information that you submit through our contact and quote forms, including your name, email address,
          phone number, project details, and language requirements.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
        <p>
          We use this information to respond to inquiries, prepare translation quotes, provide requested services, and
          communicate with you about your project. We do not sell your personal information.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Data Security</h2>
        <p>
          We use server-side validation, CAPTCHA verification, and request throttling to reduce abuse. Access to data is
          restricted to authorized personnel and service providers supporting our operations.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact</h2>
        <p>
          For privacy-related questions, contact us at{' '}
          <a href="mailto:getlugha@gmail.com" className="text-primary-600 hover:underline">
            getlugha@gmail.com
          </a>
          .
        </p>
      </section>
    </InnerPageLayout>
  );
}
