import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/">
              <img src="/Logo.png" alt="Combat Corner Logo" className="h-16 w-auto brightness-0 invert" />
            </Link>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              Bangladesh's premier destination for combat sports news, event coverage, and fighter profiles. Join our community of martial arts enthusiasts.
            </p>
            <div className="flex gap-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-lg">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:justify-self-end">
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-10 border-b border-gray-800 pb-4 inline-block">Get In Touch</h4>
            <ul className="space-y-8">
              <li className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-orange-500" />
                </div>
                <p className="text-md text-gray-400 font-medium">123 Combat Street, Sport Zone<br />Dhaka, Bangladesh</p>
              </li>
              <li className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center flex-shrink-0">
                  <FaPhoneAlt className="text-orange-500" />
                </div>
                <p className="text-md text-gray-400 font-medium">+880 1234 567890</p>
              </li>
              <li className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-orange-500" />
                </div>
                <p className="text-md text-gray-400 font-medium">info@combatcorner.com</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Links - Single Horizontal Line */}
        <div className="border-t border-gray-800 py-12">
          <ul className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {['Home', 'Latest News', 'Fighter Rankings', 'Event Calendar', 'About Us', 'Contact Us'].map((link) => (
              <li key={link}>
                <Link to="/" className="text-gray-400 hover:text-orange-500 transition-all duration-300 text-sm font-black uppercase tracking-[0.2em] group flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-orange-600 scale-0 group-hover:scale-100 transition-transform"></span>
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em]">
            &copy; {new Date().getFullYear()} Combat Corner Bangladesh. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
            <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
