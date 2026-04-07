import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { notifyQuoteRequest } from '../lib/notify';

interface ComparisonPackage {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

const packages: ComparisonPackage[] = [
  {
    name: 'Basic',
    price: 'Custom',
    features: [
      'Up to 5,000 words',
      'Standard turnaround (7-10 days)',
      'Single language pair',
      'Email support',
      'Standard quality assurance',
    ],
  },
  {
    name: 'Professional',
    price: 'Custom',
    features: [
      'Up to 50,000 words',
      'Expedited turnaround (3-5 days)',
      'Multiple language pairs',
      'Priority support',
      'Advanced quality assurance',
      'Subject matter expert review',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Unlimited words',
      'Rush service (24-48 hours)',
      'Any language combination',
      'Dedicated account manager',
      'Premium quality assurance',
      'Localization support',
      'Post-delivery revision guarantee',
    ],
  },
];

export default function Comparisons() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Professional');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sourceLanguage: '',
    targetLanguages: [] as string[],
    wordCount: '',
    urgency: 'standard',
    message: '',
  });

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Japanese', 'Portuguese'];

  const handleTargetLanguageChange = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      targetLanguages: prev.targetLanguages.includes(lang)
        ? prev.targetLanguages.filter(l => l !== lang)
        : [...prev.targetLanguages, lang],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase
        .from('quote_requests')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            category: selectedPackage,
            description: `Word Count: ${formData.wordCount}, Source: ${formData.sourceLanguage}`,
            urgency: formData.urgency,
            source_language: formData.sourceLanguage,
            target_languages: formData.targetLanguages,
            message: formData.message || null,
            status: 'pending',
          },
        ]);

      if (error) throw error;

      // Notify owner via email (fire-and-forget, never blocks the user)
      notifyQuoteRequest({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        category: selectedPackage,
        wordCount: formData.wordCount,
        sourceLanguage: formData.sourceLanguage,
        targetLanguages: formData.targetLanguages,
        urgency: formData.urgency,
        message: formData.message,
      });

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        sourceLanguage: '',
        targetLanguages: [],
        wordCount: '',
        urgency: 'standard',
        message: '',
      });
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(false);
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="comparisons" className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Compare Our Services
          </h2>
          <p className="text-xl text-gray-600">
            Choose the package that best fits your translation needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`rounded-xl border transition-all cursor-pointer ${expandedIndex === index
                  ? 'border-primary-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
                } ${pkg.highlighted ? 'md:ring-2 ring-primary-500' : ''}`}
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
                    <p className="text-lg font-semibold text-primary-600 mt-2">{pkg.price}</p>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`text-gray-400 transition-transform ${expandedIndex === index ? 'rotate-180' : ''
                      }`}
                  />
                </div>

                <ul className={`space-y-3 ${expandedIndex === index ? '' : 'max-h-32 overflow-hidden'}`}>
                  {pkg.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <span className="text-primary-500 mr-3 flex-shrink-0">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {expandedIndex === index && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPackage(pkg.name);
                      setShowForm(true);
                    }}
                    className="w-full mt-6 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Request Quote
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Get a Quote - {selectedPackage}</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {submitSuccess && (
                  <div className="p-4 bg-accent-50 border border-accent-200 rounded-lg">
                    <p className="text-accent-800 font-medium">Quote request submitted successfully! We will contact you soon.</p>
                  </div>
                )}
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">{errorMessage}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Word Count *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.wordCount}
                      onChange={(e) => setFormData({ ...formData, wordCount: e.target.value })}
                      placeholder="e.g., 5000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Source Language *
                    </label>
                    <select
                      required
                      value={formData.sourceLanguage}
                      onChange={(e) => setFormData({ ...formData, sourceLanguage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select language</option>
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Urgency *
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="standard">Standard (7-10 days)</option>
                      <option value="expedited">Expedited (3-5 days)</option>
                      <option value="rush">Rush (24-48 hours)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Languages *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <label key={lang} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.targetLanguages.includes(lang)}
                          onChange={() => handleTargetLanguageChange(lang)}
                          className="rounded border-gray-300 text-primary-600"
                        />
                        <span className="ml-2 text-gray-700">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    placeholder="Any additional details about your project..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || submitSuccess}
                    className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
