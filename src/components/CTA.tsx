import { ArrowRight, MessageCircle } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
          <span className="text-white font-medium text-sm">Ready to Get Started?</span>
        </div>

        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Break Language Barriers Today
        </h2>

        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join 500+ organizations using Lugha for specialized translation services.
          Get started with a free quote or speak with our team.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#contact" className="group px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl font-semibold text-lg flex items-center space-x-2">
            <span>Get Free Quote</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>

          <a href="https://wa.me/255744381263?text=Hi%20Lugha!%20I%20need%20translation%20services." target="_blank" rel="noopener noreferrer" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all font-semibold text-lg flex items-center space-x-2">
            <MessageCircle size={20} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        <div className="mt-12 flex items-center justify-center space-x-8 text-white/80">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>24/7 Support</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30" />
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Fast Turnaround</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30" />
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Quality Guaranteed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
