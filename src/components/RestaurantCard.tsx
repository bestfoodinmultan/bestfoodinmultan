import React from 'react';
import { Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import { translations, neighbourhoodLabels, categoryLabels } from '../utils/translations';
import { Star, Clock, MapPin, ExternalLink, MessageCircle, CheckCircle2, Globe, Tag } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onSelect }) => {
  const { language } = useApp();
  const t = translations[language];

  const primaryCuisine = restaurant.cuisines[0] || 'desi';
  const cuisineName = categoryLabels[language][primaryCuisine] || primaryCuisine;
  const areaName = neighbourhoodLabels[language][restaurant.neighbourhood] || restaurant.neighbourhood;

  return (
    <div className="group bg-[#F8F7F4] text-[#1A1A1A] p-5 sm:p-6 flex flex-col justify-between transition-colors hover:bg-white border border-[#1A1A1A]/10 hover:border-[#1A1A1A]">
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1A1A1A]/10 mb-4 border border-[#1A1A1A]/15">
          <img
            src={restaurant.coverImage}
            alt={language === 'ur' ? restaurant.nameUr : restaurant.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-[#1B4332]/10 pointer-events-none" />

          {/* Top Indicators */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs">
            {restaurant.isVerified && (
              <span className="bg-[#1B4332] text-white px-2 py-0.5 text-[9px] font-editorial-mono uppercase font-bold tracking-wider">
                {t.verified}
              </span>
            )}
            <div className="ml-auto bg-[#1A1A1A]/90 text-white px-2 py-0.5 text-[10px] font-editorial-mono font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#B38B3F] text-[#B38B3F]" />
              <span>{restaurant.rating}</span>
            </div>
          </div>

          {/* Bottom Time & Fee */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-editorial-mono text-white bg-[#1A1A1A]/85 px-2 py-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#B38B3F]" />
              <span>{restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax}m</span>
            </span>
            <span>
              {language === 'ur' ? `₨${restaurant.deliveryFeePKR} ڈلیوری` : `₨${restaurant.deliveryFeePKR} Fee`}
            </span>
          </div>
        </div>

        {/* Space Mono Metadata Line (Matching Variation 2 .label) */}
        <div className="flex items-center justify-between text-[11px] font-editorial-mono text-[#B38B3F] font-bold mb-1.5">
          <span>{areaName}</span>
          <span className="text-[#1A1A1A]/50 font-normal">{cuisineName}</span>
        </div>

        {/* Restaurant Title (Cormorant Garamond Serif) */}
        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1A1A1A] group-hover:text-[#B38B3F] transition-colors line-clamp-1 mb-1.5 leading-tight">
          {language === 'ur' ? restaurant.nameUr : restaurant.name}
        </h3>

        {/* Tagline */}
        <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 leading-relaxed mb-3 font-sans">
          {language === 'ur' ? restaurant.taglineUr : restaurant.tagline}
        </p>

        {restaurant.activeDealBanner && (
          <div className="flex items-center gap-1.5 text-[10px] font-editorial-mono font-bold text-[#1B4332] bg-[#1B4332]/10 px-2 py-1 mb-3 border border-[#1B4332]/20">
            <Tag className="w-3 h-3 shrink-0 text-[#1B4332]" />
            <span className="truncate">
              {language === 'ur' ? 'لائیو آفرز دستیاب ہیں' : 'Live Deals Active (14thstreetpizza.com)'}
            </span>
          </div>
        )}

        {/* Multan Address snippet */}
        <div className="flex items-center gap-1.5 text-[11px] font-editorial-mono text-[#1A1A1A]/55 mb-4 line-clamp-1">
          <MapPin className="w-3 h-3 text-[#B38B3F] shrink-0" />
          <span className="truncate">{language === 'ur' ? restaurant.addressUr : restaurant.address}</span>
        </div>
      </div>

      {/* Card Action Footer matching Variation 2 buttons */}
      <div className="pt-3 border-t border-[#1A1A1A]/10 flex flex-wrap items-center gap-2">
        <button
          onClick={() => onSelect(restaurant)}
          className="btn-editorial-primary flex-1 text-center py-2 text-xs"
        >
          {t.viewMenu}
        </button>

        <a
          href={restaurant.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={t.mapsLocation}
          className="pill-editorial text-[10px] py-1.5 px-2.5"
        >
          Map
        </a>

        {restaurant.websiteUrl && (
          <a
            href={restaurant.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`${restaurant.name} - ${t.website}`}
            className="pill-editorial text-[10px] py-1.5 px-2.5"
          >
            Web
          </a>
        )}

        <a
          href={`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(
            `Salam ${restaurant.name}, I am exploring your menu on Best Food In Multan.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          title={t.whatsappOrder}
          className="pill-editorial text-[10px] py-1.5 px-2.5 text-[#1B4332] border-[#1B4332]"
        >
          WA
        </a>
      </div>
    </div>
  );
};
