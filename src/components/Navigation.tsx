import { Menu, X, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

   const handleWhatsApp = () => {
    window.open(
      'https://wa.me/255744381263?text=Hi%20Lugha!%20I%20need%20translation%20services.',
      '_blank'
    );
  };

  const scrollToComparisons = () => {
    if (!isHome) return;
    const element = document.getElementById('comparisons');
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2">
            <img src="/lugha_logo_file-02.png" alt="Lugha" className="h-10" />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href={isHome ? '#categories' : '/#categories'} className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Categories
            </a>
            <a href="#comparisons" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Pricing
            </a>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Contact
            </Link>
            <Link to="/our-team" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Our Team
            </Link>
            <a
              href={isHome ? '#comparisons' : '/#comparisons'}
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault();
                  scrollToComparisons();
                }
              }}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Get Quote
            </a>
            <button
              onClick={handleWhatsApp}
              className="p-2 text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={24} />
            </button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <a href={isHome ? '#categories' : '/#categories'} className="block py-2 text-gray-700 hover:text-primary-600 font-medium">
              Categories
            </a>
            <a href={isHome ? '#comparisons' : '/#comparisons'} className="block py-2 text-gray-700 hover:text-primary-600 font-medium">
              Pricing
            </a>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-primary-600 font-medium">
              Contact
            </Link>
            <a
              href={isHome ? '#comparisons' : '/#comparisons'}
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault();
                  scrollToComparisons();
                } else {
                  setIsMenuOpen(false);
                }
              }}
              className="block text-center w-full px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Get Quote
            </a>
            <button
              onClick={handleWhatsApp}
              className="w-full px-6 py-2.5 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
