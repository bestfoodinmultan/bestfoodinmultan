import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setView, setRole, restaurants, menuItems } = useApp();
  const t = translations[language];

  return (
    <footer className="bg-white text-[#1A1A1A] border-t-[1.5px] border-[#1A1A1A] py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#1A1A1A]/15">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="font-display text-3xl font-bold lowercase italic text-[#1A1A1A]">
              best food in <span className="text-[#B38B3F] not-italic">multan</span>
            </div>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/70 max-w-sm leading-relaxed font-sans">
              {language === 'ur'
                ? 'مدینۃ الاولیاء ملتان کے تاریخی اور جدید کھانوں کا اولین مستند پلیٹ فارم — 1930 کے حافظ سوہن حلوہ سے لے کر شنواری کڑاہی اور پیزا ڈیلز تک۔'
                : 'City of Saints, Punjab, Pakistan (ملتان، پاکستان). Home of the historic world-famed Sohan Halwa, clay-tandoor Shinwari feasts, and fast-food portals.'}
            </p>
            <div className="flex items-center gap-2 text-xs font-editorial-mono text-[#B38B3F] font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>MULTAN, PUNJAB, PAKISTAN</span>
            </div>
          </div>

          {/* Multan Food Heritage (2.5 cols) */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-label block text-[#B38B3F]">
              [ {language === 'ur' ? 'روایتی ذائقے' : 'Cuisines'} ]
            </span>
            <ul className="space-y-2 text-xs font-sans text-[#1A1A1A]/80 font-medium">
              <li>Hafiz Multani Sohan Halwa</li>
              <li>Traditional Doli Roti</li>
              <li>Bosan Road Shinwari Karahi</li>
              <li>Gulgasht Charcoal BBQ & Chaamp</li>
              <li>14th Street Monster Slices</li>
              <li>Multani Rabri Falooda</li>
            </ul>
          </div>

          {/* Quick Portals (2.5 cols) */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-label block text-[#B38B3F]">
              [ {language === 'ur' ? 'پورٹلز' : 'Links'} ]
            </span>
            <ul className="space-y-2 text-xs font-sans text-[#1A1A1A]/80 font-medium">
              <li>
                <button
                  onClick={() => setView('explore')}
                  className="hover:text-[#B38B3F] transition-colors cursor-pointer text-left"
                >
                  {language === 'ur' ? 'ریسٹورنٹ ڈائریکٹری' : 'Directory'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('restaurant_owner');
                    setView('owner-dashboard');
                  }}
                  className="hover:text-[#B38B3F] transition-colors cursor-pointer text-left"
                >
                  {language === 'ur' ? 'ریسٹورنٹ اونر لاگ ان' : 'Restaurant Portal'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('admin');
                    setView('admin-dashboard');
                  }}
                  className="hover:text-[#B38B3F] transition-colors cursor-pointer text-left"
                >
                  {language === 'ur' ? 'ایڈمن کنٹرول پینل' : 'Admin & Database'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView('track-order')}
                  className="hover:text-[#B38B3F] transition-colors cursor-pointer text-left"
                >
                  {language === 'ur' ? 'لائیو آرڈر ٹریکر' : 'Order Tracking'}
                </button>
              </li>
            </ul>
          </div>

          {/* Live Statistics (2 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-label block text-[#B38B3F]">
              [ Directory Stats ]
            </span>
            <div className="space-y-3">
              <div>
                <div className="font-display text-3xl font-bold text-[#1B4332] leading-none">
                  {restaurants.length}
                </div>
                <div className="font-editorial-mono text-[10px] uppercase text-[#1A1A1A]/60 mt-0.5">
                  Verified Restaurants & Sweetmakers
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-[#B38B3F] leading-none">
                  {menuItems.length}
                </div>
                <div className="font-editorial-mono text-[10px] uppercase text-[#1A1A1A]/60 mt-0.5">
                  Verified Menu Dishes with Rates
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Editorial Copyright Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-editorial-mono uppercase tracking-wider text-[#1A1A1A]/60">
          <div>
            © {new Date().getFullYear()} Best Food In Multan. Editorial Edition.
          </div>
          <div className="flex items-center gap-2">
            <span>Crafted for</span>
            <span className="text-[#B38B3F] font-bold">Multan, Punjab, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
