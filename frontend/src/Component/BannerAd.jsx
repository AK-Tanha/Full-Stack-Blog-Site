import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoClose } from "react-icons/io5";
import { useFetchAdsQuery } from '../redux/features/ads/adsApi';

const BannerAd = ({ slot = "horizontal", className = "" }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  
  // Fetch active ads for this specific slot
  const { data: ads, isLoading } = useFetchAdsQuery({ slot, isActive: true });
  
  const [currentAd, setCurrentAd] = useState(null);

  const staticConfigs = {
    horizontal: {
      container: "w-full max-w-5xl mx-auto my-12",
      content: "h-[100px] md:h-[120px] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-white/5 shadow-2xl",
      image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=1200", 
      title: "PREMIUM FIGHT GEAR",
      subtitle: "UP TO 40% OFF ON ALL EQUIPMENT",
      cta: "SHOP NOW",
      link: "#"
    },
    masthead: {
      container: "w-full mx-auto",
      content: "h-[70px] md:h-[90px] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-white/5 shadow-lg",
      image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=1200",
      title: "PREMIUM FIGHT GEAR",
      subtitle: "EXCLUSIVE OFFERS",
      cta: "SHOP",
      link: "#"
    },
    sidebar: {
      container: "w-full my-8",
      content: "aspect-square bg-gray-900 border border-white/5 shadow-xl",
      image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&q=80&w=600", 
      title: "EXTREME ENERGY",
      subtitle: "FOR THE MODERN WARRIOR",
      cta: "GET POWERED",
      link: "#"
    },
    mobile: {
      container: "w-full my-6",
      content: "h-[80px] bg-gray-900 border border-white/5 shadow-lg",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400", 
      title: "LIVE ODDS",
      subtitle: "BET ON THE GO",
      cta: "BET NOW",
      link: "#"
    }
  };

  useEffect(() => {
    if (ads && ads.length > 0) {
      // Pick the latest ad for this slot
      setCurrentAd(ads[0]);
    } else {
      // Fallback to static config if no dynamic ads are available
      setCurrentAd(staticConfigs[slot] || staticConfigs.horizontal);
    }
  }, [ads, slot]);

  if (!isVisible || isLoading || !currentAd) return null;

  const containerClass = staticConfigs[slot]?.container || staticConfigs.horizontal.container;
  const contentClass = staticConfigs[slot]?.content || staticConfigs.horizontal.content;

  return (
    <div className={`${containerClass} ${className} group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-700`}>
      <div className="flex justify-between items-center mb-1 px-2">
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">
          {t('sponsored') || "Sponsored Content"}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-bold text-gray-300 hover:text-orange-600 cursor-help transition-colors">
            ⓘ
          </span>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
            title="Dismiss Ad"
          >
            <IoClose size={12} />
          </button>
        </div>
      </div>
      
      <a 
        href={currentAd.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`relative block overflow-hidden rounded-2xl ${contentClass}`}
      >
        <img 
          src={currentAd.image} 
          alt={currentAd.title} 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

        <div className="relative h-full flex items-center px-6 md:px-10 justify-between">
          <div className="max-w-[70%]">
            <h4 className="text-white text-xs md:text-sm font-black uppercase tracking-widest mb-1 drop-shadow-md">
              {currentAd.title}
            </h4>
            <p className="text-white/60 text-[9px] md:text-[11px] font-bold uppercase tracking-wider line-clamp-1">
              {currentAd.subtitle}
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <button className="bg-orange-600 hover:bg-orange-500 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-all shadow-lg hover:shadow-orange-600/20 active:scale-95">
              {currentAd.cta || 'LEARN MORE'}
            </button>
          </div>
        </div>

        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
      </a>
    </div>
  );
};

export default BannerAd;
