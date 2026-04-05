import { Upload, Target, Users, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Content',
    description: 'Share your document or content with us. We support 50+ file formats and can handle projects of any size.',
  },
  {
    icon: Target,
    title: 'Select Your Category',
    description: 'Choose from Legal, Medical, Tech, Business, Education, or General translation categories for specialized expertise.',
  },
  {
    icon: Users,
    title: 'Expert Matching',
    description: 'Our AI matches you with certified translators who have specific experience in your industry and language pair.',
  },
  {
    icon: CheckCircle,
    title: 'Quality Delivery',
    description: 'Receive your translation with quality assurance, on time. Revisions included to ensure 100% satisfaction.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full mb-4">
            <span className="text-primary-700 font-medium text-sm">Simple Process</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From upload to delivery in four simple steps. Get professional translations
            faster than ever with our streamlined process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary-300 to-transparent" />
                )}

                <div className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-primary-500 rounded-2xl blur-xl opacity-20" />
                      <div className="relative w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Icon className="text-white" size={40} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-4 border-primary-500 rounded-full flex items-center justify-center font-bold text-primary-500">
                        {index + 1}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-primary-50 to-accent-50 px-8 py-4 rounded-xl">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-primary-500 border-2 border-white" />
              <div className="w-10 h-10 rounded-full bg-accent-500 border-2 border-white" />
              <div className="w-10 h-10 rounded-full bg-primary-600 border-2 border-white" />
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-600">Average turnaround time</div>
              <div className="text-2xl font-bold text-gray-900">24-48 hours</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
