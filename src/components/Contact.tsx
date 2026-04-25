import { useState } from 'react';
import { Mail, Phone, MessageSquare, Upload, FileText, X } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileInstance, setTurnstileInstance] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<{ content: string; name: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setErrorMessage(null);
    
    if (selectedFile) {
      // 5MB limit
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must be less than 5MB.');
        e.target.value = '';
        setFile(null);
        setFileData(null);
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setFileData({ content: base64String, name: selectedFile.name });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileData(null);
    const fileInput = document.getElementById('document') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      setErrorMessage('Please complete the CAPTCHA challenge.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.functions.invoke('submit-contact-inquiry', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          turnstileToken,
          fileContent: fileData?.content,
          fileName: fileData?.name,
        },
      });

      if (error) throw error;

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTurnstileToken(null);
      setFile(null);
      setFileData(null);
      setTurnstileInstance((prev) => prev + 1);

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600">
            Have questions? We're here to help and answer any question you might have
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8">
            <Mail className="text-primary-600 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-700 mb-4">Send us an email and we'll respond within 24 hours</p>
            <a href="mailto:getlugha@gmail.com" className="text-primary-600 font-medium hover:underline">
              getlugha@gmail.com
            </a>
          </div>

          <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-8">
            <Phone className="text-accent-600 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-700 mb-4">Call us to discuss your project needs</p>
            <a href="tel:+255744381263" className="text-accent-600 font-medium hover:underline">
              +255 744 381 263
            </a>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8">
            <MessageSquare className="text-orange-600 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-gray-700 mb-4">Chat with us on WhatsApp for quick assistance</p>
            <a
              href="https://wa.me/255744381263?text=Hi%20Lugha!%20I%20need%20translation%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-medium hover:underline"
            >
              Start Chat
            </a>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

            {submitted && (
              <div className="mb-6 p-4 bg-accent-50 border border-accent-200 rounded-lg">
                <p className="text-accent-800 font-medium">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+1 (234) 567-8900"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a subject</option>
                  <option value="quote">Quote Inquiry</option>
                  <option value="support">Support Request</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
                  Attach Document (Optional, Max 5MB)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="document"
                    name="document"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  />
                  {!file ? (
                    <label
                      htmlFor="document"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all text-gray-500"
                    >
                      <Upload size={20} />
                      <span className="text-sm font-medium">Click to upload or drag and drop</span>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-primary-50 border border-primary-200 rounded-lg">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                          <FileText size={20} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1 hover:bg-primary-200 rounded-full text-gray-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Turnstile
                  key={turnstileInstance}
                  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onExpire={() => setTurnstileToken(null)}
                  onError={() => setTurnstileToken(null)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !turnstileToken}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
