import { Globe, Users, Award, TrendingUp } from 'lucide-react';

const values = [
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Native speakers and cultural experts across Africa and Asia, ensuring authentic communication.',
  },
  {
    icon: Users,
    title: 'Expert Network',
    description: 'Specialized translators for every industry, from legal to medical, tech to education.',
  },
  {
    icon: Award,
    title: 'Quality First',
    description: 'ISO certified processes with rigorous quality control and accuracy guarantees.',
  },
  {
    icon: TrendingUp,
    title: 'Innovation Driven',
    description: 'We continuously improve our processes and solutions to deliver smarter and more effective language services.',
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full mb-6">
              <span className="text-primary-700 font-medium text-sm">About Lugha</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              We Bridge Cultures Through Language
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded in 2020, Lugha has grown from a small team of passionate linguists to a global
              network of over 500 specialized translators serving organizations across continents.
            </p>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              What sets us apart is our category-focused approach. Instead of one-size-fits-all translation,
              we match you with experts who understand your industry's nuances, terminology, and cultural context.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Industry Specialization</h4>
                  <p className="text-gray-600">Each translator is vetted for specific industry expertise and cultural competence.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Cultural Intelligence</h4>
                  <p className="text-gray-600">We don't just translate words; we ensure your message resonates authentically.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Technology Enhanced</h4>
                  <p className="text-gray-600">We use modern CAT tools and streamlined workflows ensure faster turnaround, consistency, and high-quality delivery.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h4>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-8 rounded-2xl text-white">
              <div className="text-5xl font-bold mb-2">2026</div>
              <div className="text-xl font-semibold mb-3">Version 3.0 Launch</div>
              <p className="text-primary-100">
                Enhanced category specialization, improved workflows, and expanded language coverage for the next generation of translation services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
