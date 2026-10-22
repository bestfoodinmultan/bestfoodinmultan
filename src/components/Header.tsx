import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { ShoppingBag, Globe, UserCheck, UtensilsCrossed, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const {
    language,
    setLanguage,
    role,
    setRole,
    cart,
    view,
    setView,
    setSelectedRestaurantId,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const t = translations[language];
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavClick = (targetView: 'explore' | 'track-order' | 'owner-dashboard' | 'admin-dashboard') => {
    setSelectedRestaurantId(null);
    setView(targetView);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F4] border-b-[1.5px] border-[#1A1A1A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark (Cormorant Garamond italic lowercase with accent) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('explore')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] lowercase italic transition-colors">
              best food in <span className="text-[#B38B3F] not-italic">multan</span>
            </div>
            {language === 'ur' && (
              <div className="font-urdu text-xs text-[#1A1A1A]/70 font-semibold leading-none">
                ملتان کے تاریخی و جدید ترین پکوان
              </div>
            )}
            {language === 'en' && (
              <div className="font-label text-[9px] text-[#1A1A1A]/50 tracking-[0.2em] hidden sm:block">
                EDITORIAL FOOD DIRECTORY • EST. 1930
              </div>
            )}
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean uppercase tracking) */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1A1A1A]/70">
          <button
            onClick={() => handleNavClick('explore')}
            className={`cursor-pointer transition-all pb-1 ${
              view === 'explore' || view === 'restaurant-detail'
                ? 'text-[#1A1A1A] font-bold border-b-2 border-[#B38B3F]'
                : 'hover:text-[#1A1A1A]'
            }`}
          >
            {language === 'ur' ? 'ریسٹورنٹس' : 'Discover'}
          </button>

          <button
            onClick={() => handleNavClick('track-order')}
            className={`cursor-pointer transition-all pb-1 ${
              view === 'track-order'
                ? 'text-[#1A1A1A] font-bold border-b-2 border-[#B38B3F]'
                : 'hover:text-[#1A1A1A]'
            }`}
          >
            {language === 'ur' ? 'آرڈر ٹریکنگ' : 'Order Track'}
          </button>

          <button
            onClick={() => {
              setRole('restaurant_owner');
              handleNavClick('owner-dashboard');
            }}
            className={`cursor-pointer transition-all pb-1 ${
              view === 'owner-dashboard'
                ? 'text-[#1A1A1A] font-bold border-b-2 border-[#B38B3F]'
                : 'hover:text-[#1A1A1A]'
            }`}
          >
            {language === 'ur' ? 'ریسٹورنٹ پورٹل' : 'Restaurant Portal'}
          </button>

          <button
            onClick={() => {
              setRole('admin');
              handleNavClick('admin-dashboard');
            }}
            className={`cursor-pointer transition-all pb-1 ${
              view === 'admin-dashboard'
                ? 'text-[#1A1A1A] font-bold border-b-2 border-[#B38B3F]'
                : 'hover:text-[#1A1A1A]'
            }`}
          >
            {language === 'ur' ? 'ایڈمن' : 'Admin'}
          </button>

          <button
            onClick={() => {
              handleNavClick('explore');
              setTimeout(() => {
                document.getElementById('pizza-burger-finder')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="cursor-pointer transition-all px-3 py-1 rounded-full border border-[#1B4332] bg-[#1B4332]/5 hover:bg-[#1B4332] hover:text-white text-[#1B4332] font-editorial-mono text-[10px] tracking-wider font-bold flex items-center gap-1.5"
          >
            <span>🍕🍔</span>
            <span>{language === 'ur' ? 'پرائس فائنڈر' : 'Price Finder'}</span>
          </button>
        </nav>

        {/* Zone 3: Editorial Action Buttons (Pills matching Variation 2) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Switcher Pill */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="pill-editorial flex items-center gap-1.5"
            title="Switch Language / زبان تبدیل کریں"
          >
            <Globe className="w-3.5 h-3.5 text-[#B38B3F]" />
            <span className={language === 'en' ? 'font-urdu font-bold' : 'font-editorial-mono'}>
              {language === 'en' ? 'اردو' : 'English'}
            </span>
          </button>

          {/* Role selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="pill-editorial flex items-center gap-1.5 bg-transparent"
            >
              {role === 'customer' && <UserCheck className="w-3.5 h-3.5 text-[#1B4332]" />}
              {role === 'restaurant_owner' && <UtensilsCrossed className="w-3.5 h-3.5 text-[#B38B3F]" />}
              {role === 'admin' && <ShieldAlert className="w-3.5 h-3.5 text-[#1A1A1A]" />}
              <span className="hidden sm:inline">
                {role === 'customer'
                  ? t.portalCustomer
                  : role === 'restaurant_owner'
                  ? t.portalRestaurant
                  : t.portalAdmin}
              </span>
            </button>

            {roleMenuOpen && (
              <div
                className={`absolute ${
                  language === 'ur' ? 'left-0' : 'right-0'
                } mt-2 w-52 bg-[#F8F7F4] border-[1.5px] border-[#1A1A1A] py-2 z-50 shadow-xl`}
              >
                <div className="px-3 py-1 font-label text-[9px] text-[#1A1A1A]/50 tracking-[0.15em] border-b border-[#1A1A1A]/10 mb-1">
                  {t.switchRole}
                </div>
                <button
                  onClick={() => {
                    setRole('customer');
                    setRoleMenuOpen(false);
                    setView('explore');
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-[#1A1A1A]/5 text-xs font-semibold cursor-pointer ${
                    role === 'customer' ? 'text-[#B38B3F] bg-[#B38B3F]/10' : 'text-[#1A1A1A]'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#1B4332] shrink-0" />
                  <span>{t.portalCustomer}</span>
                </button>
                <button
                  onClick={() => {
                    setRole('restaurant_owner');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-[#1A1A1A]/5 text-xs font-semibold cursor-pointer ${
                    role === 'restaurant_owner' ? 'text-[#B38B3F] bg-[#B38B3F]/10' : 'text-[#1A1A1A]'
                  }`}
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#B38B3F] shrink-0" />
                  <span>{t.portalRestaurant}</span>
                </button>
                <button
                  onClick={() => {
                    setRole('admin');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-[#1A1A1A]/5 text-xs font-semibold cursor-pointer ${
                    role === 'admin' ? 'text-[#B38B3F] bg-[#B38B3F]/10' : 'text-[#1A1A1A]'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#1A1A1A] shrink-0" />
                  <span>{t.portalAdmin}</span>
                </button>
              </div>
            )}
          </div>

          {/* Cart Pill Button (Matching Variation 2: `<button class="pill">Cart (0)</button>`) */}
          <button
            onClick={onOpenCart}
            className={`pill-editorial flex items-center gap-2 ${
              cartItemCount > 0 ? 'bg-[#1A1A1A] text-[#F8F7F4]' : ''
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#B38B3F]" />
            <span>{language === 'ur' ? 'آرڈر' : 'Cart'} ({cartItemCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
