import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const { t, i18n } = useTranslation();

  const socialLinks = [
    { icon: FaFacebookF, color: "hover:text-[#1877F2]", url: "#" },
    { icon: FaTwitter, color: "hover:text-[#1DA1F2]", url: "#" },
    { icon: FaInstagram, color: "hover:text-[#E4405F]", url: "#" },
    { icon: FaYoutube, color: "hover:text-[#FF0000]", url: "#" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-12 font-outfit">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          {/* Brand & About */}
          <div className="space-y-6">
            <Link to="/" className="inline-block transition-opacity hover:opacity-80">
              <img
                src="/Logo.png"
                alt="Logo"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-[13px] leading-relaxed text-gray-500 max-w-sm">
              {i18n.language === 'en' 
                ? "Combat Corner BD is Bangladesh's premier destination for combat sports journalism, delivering elite coverage of MMA, Boxing, and traditional martial arts."
                : "কমব্যাট স্পোর্টস বিডি হলো বাংলাদেশের প্রধান গন্তব্য যা এমএমএ, বক্সিং এবং ঐতিহ্যবাহী মার্শাল আর্টের উচ্চমানের কভারেজ সরবরাহ করে।"
              }
            </p>
            <div className="flex gap-6 pt-2">
              {socialLinks.map((item, i) => (
                <a 
                  key={i} 
                  href={item.url} 
                  className={`text-gray-400 transition-colors duration-300 ${item.color}`}
                >
                  <item.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-col gap-8">
            <h3 className="text-gray-900 text-[11px] font-black uppercase tracking-[0.3em]">{t('explore')}</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {[t('news'), t('about'), t('contact'), t('journalistProfile'), t('privacyPolicy'), t('termsOfService')].map((item) => (
                <Link
                  key={item}
                  to="/"
                  className="text-[12px] font-bold text-gray-400 hover:text-orange-600 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Location */}
          <div className="flex flex-col gap-8">
            <h3 className="text-gray-900 text-[11px] font-black uppercase tracking-[0.3em]">{t('getInTouch')}</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <FaEnvelope className="text-orange-600 mt-1" size={14} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">General Inquiries</p>
                  <a href="mailto:info@combatcorner.com" className="text-[13px] font-bold text-gray-800 hover:text-orange-600 transition-colors">info@combatcorner.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-orange-600 mt-1" size={14} />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Headquarters</p>
                  <p className="text-[13px] font-bold text-gray-800">Dhaka, Bangladesh</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              © {new Date().getFullYear()} Combat Corner. {t('allRightsReserved')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900">Combat Sports Authority</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
