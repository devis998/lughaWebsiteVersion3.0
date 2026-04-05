import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Sarah Mwangi',
    role: 'Healthcare Director',
    company: 'Health for All Kenya',
    category: 'Lugha Medical',
    image: '👩🏾‍⚕️',
    content: 'Lugha Medical transformed our patient communication materials. Their translators understand medical terminology and cultural sensitivities. We reached 2M+ patients with accurate health information.',
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    role: 'Legal Counsel',
    company: 'Kumar & Associates',
    category: 'Lugha Legal',
    image: '👨🏽‍💼',
    content: 'The precision in legal translation is outstanding. Every contract and patent document was handled with expertise. Their certified translators understand legal nuances across jurisdictions.',
    rating: 5,
  },
  {
    name: 'Amina Hassan',
    role: 'CTO',
    company: 'TechAfrica Solutions',
    category: 'Lugha Tech',
    image: '👩🏿‍💻',
    content: 'Finally, technical translators who understand code! Our API documentation and user guides are now available in 8 languages. The quality is exceptional and turnaround time impressive.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Director',
    company: 'GlobalBrand Inc',
    category: 'Lugha Business',
    image: '👨🏻‍💼',
    content: 'Lugha Business maintained our brand voice perfectly across 12 markets. The business translators understand marketing nuances and cultural context. Our campaigns resonated authentically.',
    rating: 5,
  },
  {
    name: 'Prof. Fatima Ali',
    role: 'Dean of Education',
    company: 'East African University',
    category: 'Lugha Education',
    image: '👩🏽‍🏫',
    content: 'Our curriculum translations are pedagogically sound and culturally appropriate. Lugha Education maintained academic integrity while making content accessible to diverse learners.',
    rating: 5,
  },
  {
    name: 'James Ochieng',
    role: 'Content Creator',
    company: 'AfriStories Media',
    category: 'Lugha General',
    image: '👨🏿‍🎨',
    content: 'Affordable, fast, and culturally aware. Lugha General helps us reach audiences across Africa with authentic content that resonates. The native speakers make all the difference.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full mb-4">
            <span className="text-primary-700 font-medium text-sm">Client Success Stories</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how organizations across industries use Lugha to break language barriers
            and connect with communities worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 relative"
            >
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                <Quote className="text-white" size={24} />
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="text-5xl">{testimonial.image}</div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-primary-600 font-medium">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                {testimonial.content}
              </p>

              <div className="pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  {testimonial.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600">Organizations Trust Us</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">35,000+</div>
            <div className="text-gray-600">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">99.7%</div>
            <div className="text-gray-600">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
            <div className="text-gray-600">Languages Supported</div>
          </div>
        </div>
      </div>
    </section>
  );
}
