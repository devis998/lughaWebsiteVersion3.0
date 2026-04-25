import InnerPageLayout from '../components/InnerPageLayout';

export default function TermsOfServicePage() {
  return (
    <InnerPageLayout title="Terms of Service" subtitle="Terms that apply when using Lugha services and this website.">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Use of Website</h2>
        <p>
          By using this website, you agree to use it only for lawful purposes and to provide accurate information when
          submitting inquiries or requests.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Service Estimates and Delivery</h2>
        <p>
          Timelines, availability, and pricing shared through quotes are estimates unless confirmed in a formal agreement.
          Final terms may vary based on project scope and language requirements.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Limitation of Liability</h2>
        <p>
          Lugha is not liable for indirect or consequential damages arising from use of this website. Liability for services
          is governed by specific client agreements where applicable.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Updates to These Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the website after updates means you accept the
          revised terms.
        </p>
      </section>
    </InnerPageLayout>
  );
}
