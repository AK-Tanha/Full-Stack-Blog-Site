import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-500 py-12 border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {/* Info Section */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img
                src="/Logo.png"
                alt="Logo"
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-gray-500">
              Bangladesh's premier destination for combat sports news, event coverage, and fighter profiles.
            </p>
            <div className="flex gap-5">
              {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-gray-900 transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="md:text-right flex flex-col md:items-end justify-center gap-3">
            <p className="text-sm font-semibold text-gray-900">info@combatcorner.com</p>
            <p className="text-sm font-semibold text-gray-900">+880 1234 567890</p>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Dhaka, Bangladesh</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 pt-10 border-t border-gray-100">
          {["Home", "News", "Rankings", "Events", "About", "Contact"].map((item) => (
            <Link
              key={item}
              to="/"
              className="text-xs font-outfit font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-gray-900 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 text-[11px] uppercase tracking-[0.2em] text-gray-400">
          <p>© {new Date().getFullYear()} Combat Corner. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
