import { ArrowRight, Globe, Languages, Shield } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 -z-10" />

      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-40 left-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-primary-700 font-medium text-sm">Version 3.0 - Now Live</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Specialized Translation
              <span className="block text-primary-500 mt-2">For Every Industry</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              From legal contracts to medical records, from tech documentation to general content.
              Expert translators for your specific industry needs across Africa and Asia.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#categories" className="group px-8 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2">
                <span className="font-semibold">Explore Categories</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#contact" className="inline-block px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-primary-500 hover:text-primary-500 transition-all font-semibold">
                Get Free Quote
              </a>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Globe className="text-primary-500" size={20} />
                <span className="text-gray-600 text-sm">50+ Languages</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="text-primary-500" size={20} />
                <span className="text-gray-600 text-sm">ISO Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Languages className="text-primary-500" size={20} />
                <span className="text-gray-600 text-sm">500+ Experts</span>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl transform rotate-3 opacity-10" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
                    <div>
                      <div className="text-sm text-gray-600">Completed Projects</div>
                      <div className="text-3xl font-bold text-primary-600">2,847</div>
                    </div>
                    <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                      <Languages className="text-white" size={32} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {['General', 'Medical', 'Technical', 'Legal'].map((cat, i) => (
                      <div key={cat} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                        <span className="font-medium text-gray-700">{cat} Translation</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${93 - i * 6}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{93 - i * 6}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
