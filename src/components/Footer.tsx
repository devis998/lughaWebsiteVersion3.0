import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <img src="/lugha_logo_file-02.png" alt="Lugha" className="h-10 mb-4 brightness-0 invert" />
            <p className="text-gray-400 leading-relaxed mb-4">
              Specialized translation services connecting cultures and breaking barriers across Africa and Asia.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Lugha Legal</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Lugha Medical</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Lugha Tech</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Lugha Business</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Lugha Education</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Lugha General</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href={isHome ? '#about' : '/#about'} className="hover:text-primary-400 transition-colors">About Us</a></li>
              <li><Link to="/our-team" className="hover:text-primary-400 transition-colors">Our Team</Link></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Press Kit</a></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <div>Dar es Salaam, Tanzania</div>
                  <div>Delhi, India</div>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-primary-400 flex-shrink-0" />
                <div>
                  <div>+255 744 381 263</div>
                  <div>+91 846 938 8794</div>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-primary-400 flex-shrink-0" />
                <a href="mailto:getlugha@gmail.com" className="hover:text-primary-400 transition-colors">
                  getlugha@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              2026 Lugha. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy-policy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
              <Link to="/cookie-policy" className="hover:text-primary-400 transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
