import React from 'react';
import { useApp } from '../context/AppContext';
import { translations, neighbourhoodLabels } from '../utils/translations';
import { MultanNeighbourhood } from '../types';
import { Search, MapPin, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import heroImage from '../assets/images/hero_multan_food_spread_1792478742378.jpg';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedNeighbourhood: MultanNeighbourhood;
  setSelectedNeighbourhood: (n: MultanNeighbourhood) => void;
}

const POPULAR_AREAS: MultanNeighbourhood[] = [
  'All Areas',
  'Gulgasht Colony',
  'Bosan Road',
  'Multan Cantt',
  'Old City (Ghanta Ghar)',
  'Northern Bypass',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedNeighbourhood,
  setSelectedNeighbourhood,
}) => {
  const { language, restaurants } = useApp();
  const t = translations[language];

  const totalVerified = restaurants.filter(r => r.isVerified).length;

  return (
    <section className="border-b-[1.5px] border-[#1A1A1A] bg-[#F8F7F4] text-[#1A1A1A]">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[60vh]">
        {/* Left Editorial Text Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-center border-b lg:border-b-0 lg:border-r-[1.5px] border-[#1A1A1A]">
          {/* Label Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <span className="font-label">
              [ {language === 'ur' ? 'شہرِ اولیاء ملتان • روایتی و جدید کھانے' : 'The City of Saints • Multan Heritage' } ]
            </span>
          </div>

          {/* Large Serif Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[4.75rem] leading-[0.92] tracking-[-0.035em] text-[#1A1A1A] mb-5">
            {language === 'ur' ? (
              <span className="font-urdu leading-normal block">
                ملتان کے بہترین اور مستند پکوان
              </span>
            ) : (
              <span>
                Discover Multan’s Finest <span className="italic text-[#B38B3F]">Restaurants</span> & Famous Sweetmakers
              </span>
            )}
          </h1>

          <p className="text-sm sm:text-base text-[#1A1A1A]/70 leading-relaxed max-w-xl mb-7 font-sans">
            {language === 'ur'
              ? 'گھنٹہ گھر کے مشہور 1930 کے حافظ سوہن حلوہ سے لے کر بوسن روڈ کی شنواری کڑاہی، گلگشت باربی کیو اور 14th سٹریٹ پیزا کے لائیو مینو اور براہ راست آرڈرز۔'
              : 'From legendary 1930 Hafiz Sohan Halwa at Ghanta Ghar to sizzling Bosan Road Shinwari Karahi, Gulgasht barbecue, and authentic local kitchens.'}
          </p>

          {/* Editorial Search Bar matching Variation 2 */}
          <div className="border-[1.5px] border-[#1A1A1A] bg-[#F8F7F4] flex flex-col sm:flex-row items-stretch mb-5 shadow-xs">
            <div className="flex-1 flex items-center px-4 py-3 sm:py-3.5">
              <Search className="w-4 h-4 text-[#1A1A1A]/40 shrink-0 mr-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-transparent text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="font-editorial-mono text-[10px] text-[#1A1A1A]/50 hover:text-[#1A1A1A] uppercase tracking-wider px-1 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="border-t sm:border-t-0 sm:border-l-[1.5px] border-[#1A1A1A] flex items-center px-3 bg-[#F8F7F4]">
              <MapPin className="w-3.5 h-3.5 text-[#B38B3F] shrink-0 mr-1.5" />
              <select
                value={selectedNeighbourhood}
                onChange={e => setSelectedNeighbourhood(e.target.value as MultanNeighbourhood)}
                className="bg-transparent text-xs font-editorial-mono uppercase font-bold text-[#1A1A1A] focus:outline-none py-2.5 cursor-pointer"
              >
                {Object.keys(neighbourhoodLabels.en).map(key => (
                  <option key={key} value={key} className="text-[#1A1A1A] bg-[#F8F7F4]">
                    {neighbourhoodLabels[language][key as MultanNeighbourhood]}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('multan-restaurant-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#1A1A1A] text-[#F8F7F4] hover:bg-[#B38B3F] px-6 py-3.5 font-editorial-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer text-center"
            >
              {language === 'ur' ? 'تلاش کریں' : 'Search'}
            </button>
          </div>

          {/* Quick Area Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-label mr-1">{t.filterByArea}:</span>
            {POPULAR_AREAS.map(area => {
              const isSelected = selectedNeighbourhood === area;
              return (
                <button
                  key={area}
                  onClick={() => setSelectedNeighbourhood(area)}
                  className={`pill-editorial text-[10px] py-1 px-3 ${
                    isSelected ? 'active' : ''
                  }`}
                >
                  {neighbourhoodLabels[language][area]}
                </button>
              );
            })}
          </div>

          {/* Micro Proof Stats */}
          <div className="mt-8 pt-5 border-t border-[#1A1A1A]/10 flex flex-wrap items-center gap-6 text-[11px] font-editorial-mono uppercase text-[#1A1A1A]/70">
            <div className="flex items-center gap-1.5 font-bold text-[#1B4332]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{totalVerified} Verified Listings</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B38B3F]" />
              <span>25–45 Min Local Dispatch</span>
            </div>
            <span>•</span>
            <div>
              <span>Cash on Delivery & JazzCash</span>
            </div>
          </div>
        </div>

        {/* Right Editorial Hero Image Column with Emerald Tint */}
        <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full overflow-hidden bg-[#1A1A1A]">
          <img
            src={heroImage}
            alt="Multan culinary food spread"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale-[15%] contrast-105"
          />
          {/* Subtle Emerald Wash overlay */}
          <div className="absolute inset-0 bg-[#1B4332]/20 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent pointer-events-none" />

          {/* Floating Heritage Plaque */}
          <div className="absolute bottom-6 left-6 right-6 p-4 sm:p-5 bg-[#F8F7F4]/95 backdrop-blur-sm border-[1.5px] border-[#1A1A1A] shadow-lg">
            <span className="font-label block mb-1">
              [ Authentic Multan Culinary Archive ]
            </span>
            <div className="font-display text-lg font-bold text-[#1A1A1A] leading-snug">
              {language === 'ur'
                ? 'خالص دیسی گھی سوہن حلوہ اور کڑاہی باربی کیو'
                : 'Pure Desi Ghee Sohan Halwa & Clay Tandoor Shinwari'}
            </div>
            <div className="flex items-center justify-between text-[11px] font-editorial-mono text-[#1A1A1A]/60 mt-2 pt-2 border-t border-[#1A1A1A]/15">
              <span>MULTAN, PUNJAB, PAKISTAN</span>
              <span className="font-bold text-[#B38B3F]">EST. 1930</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
