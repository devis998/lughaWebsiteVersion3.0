import { Scale, Stethoscope, Globe, Code, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';

const categories = [
  {
    icon: Scale,
    name: 'Lugha Legal',
    tagline: 'Precision in Every Clause',
    description: 'Certified legal translators for contracts, patents, court documents, and compliance materials. Guaranteed accuracy for legal proceedings.',
    features: ['Certified Translators', 'Legal Terminology', '24/7 Rush Service', 'Confidential'],
    color: 'from-blue-500 to-blue-600',
    stats: { projects: '35,000+', accuracy: '99.9%' }
  },
  {
    icon: Stethoscope,
    name: 'Lugha Medical',
    tagline: 'Healthcare Without Barriers',
    description: 'Medical professionals translating patient records, clinical trials, pharmaceutical docs, and healthcare communications with clinical precision.',
    features: ['Medical Experts', 'HIPAA Compliant', 'Clinical Accuracy', 'Fast Turnaround'],
    color: 'from-red-500 to-red-600',
    stats: { projects: '80,00+', accuracy: '99.8%' }
  },
  {
    icon: Code,
    name: 'Lugha Tech',
    tagline: 'Code to Communication',
    description: 'Technical translators who understand software, APIs, user guides, and tech documentation. Perfect for SaaS and tech companies.',
    features: ['Tech Specialists', 'UI/UX Localization', 'API Documentation', 'Developer-Friendly'],
    color: 'from-purple-500 to-purple-600',
    stats: { projects: '61,00+', accuracy: '99.7%' }
  },
  {
    icon: Briefcase,
    name: 'Lugha Business',
    tagline: 'Global Business, Local Voice',
    description: 'Business translators for presentations, reports, marketing materials, and corporate communications that maintain your brand voice.',
    features: ['Brand Consistency', 'Market Research', 'B2B Experience', 'Industry Specific'],
    color: 'from-green-500 to-green-600',
    stats: { projects: '110,000+', accuracy: '99.5%' }
  },
  {
    icon: GraduationCap,
    name: 'Lugha Education',
    tagline: 'Knowledge Without Borders',
    description: 'Educational content translators for curricula, e-learning, research papers, and academic materials maintaining pedagogical integrity.',
    features: ['Academic Experts', 'Curriculum Design', 'E-Learning Ready', 'Research Papers'],
    color: 'from-orange-500 to-orange-600',
    stats: { projects: '240,000+', accuracy: '99.6%' }
  },
  {
    icon: Globe,
    name: 'Lugha General',
    tagline: 'Everyday Excellence',
    description: 'General content translation for websites, social media, personal documents, and everyday communication needs at affordable rates.',
    features: ['Fast Delivery', 'Affordable Rates', 'Cultural Nuance', 'Native Speakers'],
    color: 'from-teal-500 to-teal-600',
    stats: { projects: '530,000+', accuracy: '99.4%' }
  }
];

export default function Categories() {
  return (
    <section id="categories" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full mb-4">
            <span className="text-primary-700 font-medium text-sm">Our Industry-Specific Solutions</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Translation Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each category features specialized translators with industry expertise,
            ensuring accuracy and contextual relevance for your specific needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color}`} />

                <div className="p-8">
                  <div className={`w-14 h-14 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={28} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>

                  <p className="text-sm text-primary-600 font-medium mb-3">
                    {category.tagline}
                  </p>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {category.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500">Words Completed</div>
                      <div className="text-lg font-bold text-gray-900">{category.stats.projects}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                      <div className="text-lg font-bold text-primary-600">{category.stats.accuracy}</div>
                    </div>
                    <button className="p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <a href="#comparisons" className="inline-block px-8 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl">
            Compare All Categories
          </a>
        </div>
      </div>
    </section>
  );
}
