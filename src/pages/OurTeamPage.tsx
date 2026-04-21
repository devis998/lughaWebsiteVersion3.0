import InnerPageLayout from '../components/InnerPageLayout';

export default function OurTeamPage() {
  return (
    <InnerPageLayout title="Our Team" subtitle="Meet the people behind Lugha's translation services.">
      <section>
        <p>
          Lugha combines language specialists, project coordinators, and quality reviewers to deliver culturally accurate
          translations for clients across Africa and Asia.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 gap-6">
        <div className="p-5 border border-gray-200 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Language Specialists</h2>
          <p>Experts in source and target language pairs focused on precision, tone, and context.</p>
        </div>
        <div className="p-5 border border-gray-200 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Project Managers</h2>
          <p>Dedicated coordinators ensuring timelines, communication, and smooth delivery.</p>
        </div>
        <div className="p-5 border border-gray-200 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Quality Assurance</h2>
          <p>Reviewers who perform consistency checks and final quality control.</p>
        </div>
        <div className="p-5 border border-gray-200 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Client Support</h2>
          <p>Support staff assisting with onboarding, inquiries, and follow-up after delivery.</p>
        </div>
      </section>
    </InnerPageLayout>
  );
}
