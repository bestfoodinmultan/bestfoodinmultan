/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetailView } from './components/RestaurantDetailView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SingleRestaurantModal } from './components/SingleRestaurantModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { RestaurantOwnerDashboard } from './components/RestaurantOwnerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PizzaBurgerPriceFinder } from './components/PizzaBurgerPriceFinder';
import { Footer } from './components/Footer';
import { CuisineCategory, MenuItem, MultanNeighbourhood, Restaurant } from './types';
import { translations, categoryLabels, neighbourhoodLabels } from './utils/translations';
import { Sparkles, Utensils, CheckCircle2, Globe, ExternalLink, Tag, Camera } from 'lucide-react';

import sohanHalwaImg from './assets/images/multani_sohan_halwa_box_1792478743436.jpg';
import bbqKarahiImg from './assets/images/multan_sizzling_bbq_karahi_1792478743512.jpg';
import pizzaImg from './assets/images/multan_gourmet_pizza_1792478744000.jpg';

function MainApp() {
  const {
    language,
    view,
    setView,
    restaurants,
    selectedRestaurantId,
    setSelectedRestaurantId,
    forceAddToCartAndClear,
    addToCart,
  } = useApp();

  const t = translations[language];

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<MultanNeighbourhood>('All Areas');
  const [selectedCategory, setSelectedCategory] = useState<CuisineCategory>('all');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Single Restaurant Cart Conflict State
  const [conflictModalData, setConflictModalData] = useState<{
    pendingItem: MenuItem;
    conflictingRestaurant: Restaurant;
  } | null>(null);

  // Selected restaurant object for detail view
  const selectedRestaurant = restaurants.find(r => r.id === selectedRestaurantId);

  // Filter restaurants
  const filteredRestaurants = restaurants.filter(r => {
    // Only published in customer directory
    if (!r.isPublished) return false;

    // Search query matching English/Urdu name, cuisines, or address
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q) || r.nameUr.includes(q);
      const matchArea = r.neighbourhood.toLowerCase().includes(q) || r.address.toLowerCase().includes(q);
      const matchCuisine = r.cuisines.some(c => c.toLowerCase().includes(q));
      const matchTagline = r.tagline.toLowerCase().includes(q) || r.taglineUr.includes(q);
      const matchDeal = (r.activeDealBanner && r.activeDealBanner.toLowerCase().includes(q)) || false;
      if (!matchName && !matchArea && !matchCuisine && !matchTagline && !matchDeal) return false;
    }

    // Neighbourhood filter
    if (selectedNeighbourhood !== 'All Areas' && r.neighbourhood !== selectedNeighbourhood) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && !r.cuisines.includes(selectedCategory)) {
      return false;
    }

    return true;
  });

  const handleSelectRestaurant = (r: Restaurant) => {
    setSelectedRestaurantId(r.id);
    setView('restaurant-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConflict = (item: MenuItem, conflictingRestaurant: Restaurant) => {
    setConflictModalData({ pendingItem: item, conflictingRestaurant });
  };

  const handleResolveConflict = () => {
    if (conflictModalData) {
      forceAddToCartAndClear(conflictModalData.pendingItem, 1);
      setConflictModalData(null);
    }
  };

  const handlePriceFinderSelectItem = (item: MenuItem, restaurant: Restaurant) => {
    const result = addToCart(item, 1);
    if (!result.success && result.conflictingRestaurant) {
      handleConflict(item, result.conflictingRestaurant);
    } else {
      setIsCartOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#1A1A1A] selection:bg-[#B38B3F]/20 selection:text-[#1A1A1A]">
      {/* Top Bar Contract Compliant Header */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      {/* Main View Router */}
      <main className="flex-1">
        {view === 'explore' && (
          <div>
            {/* Hero Section */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedNeighbourhood={selectedNeighbourhood}
              setSelectedNeighbourhood={setSelectedNeighbourhood}
            />

            {/* 🍕 Pizza & 🍔 Burger Price Finder (Prominent Top Section) */}
            <PizzaBurgerPriceFinder
              onSelectItem={handlePriceFinderSelectItem}
              onSelectRestaurant={handleSelectRestaurant}
            />

            {/* Category Filter Bar */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Multan Food Heritage Spotlight Row (Editorial Edition) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
              <div className="bg-[#1B4332] text-white border-[1.5px] border-[#1A1A1A] p-6 sm:p-8">
                <div className="max-w-3xl">
                  <span className="font-label text-[#B38B3F] block mb-2">
                    [ {t.multanHeritage} ]
                  </span>
                  <h2 className="font-display text-2xl sm:text-4xl font-bold mb-2 text-white leading-tight">
                    {language === 'ur'
                      ? 'اصلی ملتانی سوہن حلوہ اور شنواری کڑاہی کا شاہکار ذائقہ'
                      : 'Authentic Multani Sweets & Clay-Tandoor Feasts'}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                    {language === 'ur'
                      ? 'مدینۃ الاولیاء ملتان کا سوہن حلوہ پوری دنیا میں اپنی مثال آپ ہے۔ ہم نے ملتان کے 1930 سے قائم تاریخی کاریگروں اور گلگشت و بوسن روڈ کے معروف کڑاہی باربی کیو ہوٹلوں کو ایک مستند پلیٹ فارم پر یکجا کیا ہے۔'
                      : 'Celebrated across the globe for its caramelized pure desi ghee Sohan Halwa, spiced Doli Roti, and sizzling Shinwari Karahi cooked over high flames. Order directly from authentic Multan kitchens.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Official Brand Web Portals & Verified Live Websites */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6">
              <div className="editorial-grid grid grid-cols-1 md:grid-cols-2">
                {/* 14th Street Pizza Portal Box */}
                <div className="bg-[#F8F7F4] text-[#1A1A1A] p-6 sm:p-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#1B4332] animate-pulse" />
                        <span className="font-label text-[#B38B3F]">
                          {language === 'ur' ? 'آفیشل ویب سائٹ اور ڈیلز' : 'Official Online Store & Deals'}
                        </span>
                      </div>
                      <span className="text-[11px] font-editorial-mono text-[#1A1A1A]/60">Bosan Road & Gulgasht</span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-[#1A1A1A] mb-1.5 flex items-baseline gap-2">
                      <span>14th Street Pizza Multan</span>
                      <span className="text-xs font-editorial-mono font-bold text-[#B38B3F]">
                        20" Monster Slice
                      </span>
                    </h3>

                    <p className="text-xs text-[#1A1A1A]/70 mb-5 leading-relaxed font-sans">
                      {language === 'ur'
                        ? '14thstreetpizza.com کی تمام لائیو ڈیلز، سپر سنڈے 50% رعایت اور دیر رات 3 بجے تک کی ڈلیوری مینو دیکھیں اور براہ راست آرڈر کریں۔'
                        : 'Explore all live deals, 50% Off Super Sunday, Midnight Craving specials and monster slices directly from 14thstreetpizza.com.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-[#1A1A1A]/10">
                    <button
                      onClick={() => {
                        const r = restaurants.find(x => x.id === 'rest-14th-street');
                        if (r) handleSelectRestaurant(r);
                      }}
                      className="btn-editorial-primary flex-1 py-2 text-center text-xs"
                    >
                      {language === 'ur' ? 'مینو اور ڈیلز دیکھیں' : 'View Multan Menu & Deals'}
                    </button>
                    <a
                      href="https://www.14thstreetpizza.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill-editorial text-xs py-2 px-3 flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#B38B3F]" />
                      <span>14thstreetpizza.com</span>
                      <ExternalLink className="w-3 h-3 text-[#1A1A1A]/50" />
                    </a>
                  </div>
                </div>

                {/* Hafiz Ka Multani Sohan Halwa Portal Box */}
                <div className="bg-[#F8F7F4] text-[#1A1A1A] p-6 sm:p-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#B38B3F] animate-pulse" />
                        <span className="font-label text-[#B38B3F]">
                          {language === 'ur' ? 'آفیشل آن لائن پورٹل — 1930 سے' : 'Official Online Store — Since 1930'}
                        </span>
                      </div>
                      <span className="text-[11px] font-editorial-mono text-[#1A1A1A]/60">Hussain Agahi Chowk</span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-[#1A1A1A] mb-1.5 flex items-baseline gap-2">
                      <span>{language === 'ur' ? 'حافظ کا ملتانی سوہن حلوہ' : 'Hafiz Ka Multani Sohan Halwa'}</span>
                      <span className="text-xs font-editorial-mono font-bold text-[#1B4332]">
                        100% Desi Ghee
                      </span>
                    </h3>

                    <p className="text-xs text-[#1A1A1A]/70 mb-5 leading-relaxed font-sans">
                      {language === 'ur'
                        ? 'hafizhalwa.com کا آفیشل مینو، شاہی 4 ان 1 باکس، نیلی مٹی کا روایتی مٹکا اور 1930 کی تاریخی و لائیو تصاویر ملاحظہ کریں۔'
                        : 'Discover pure desi ghee Sohan Halwa, Royal 4-in-1 gift tins, Multani blue pottery matka and complete 1930 to modern picture archives.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-[#1A1A1A]/10">
                    <button
                      onClick={() => {
                        const r = restaurants.find(x => x.id === 'rest-hafiz-halwa');
                        if (r) handleSelectRestaurant(r);
                      }}
                      className="btn-editorial-primary flex-1 py-2 text-center text-xs"
                    >
                      {language === 'ur' ? 'مینو اور تاریخی تصاویر' : 'View Menu & Live/Past Pictures'}
                    </button>
                    <a
                      href="https://hafizhalwa.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill-editorial text-xs py-2 px-3 flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#B38B3F]" />
                      <span>hafizhalwa.com</span>
                      <ExternalLink className="w-3 h-3 text-[#1A1A1A]/50" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant Listings Section matching Variation 2 */}
            <section id="multan-restaurant-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-6 pb-3 border-b-[1.5px] border-[#1A1A1A]">
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight">
                    {language === 'ur' ? 'ملتان کے ریسٹورنٹس' : 'Restaurants'}
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-editorial-mono text-[#1A1A1A]/60 mt-1 uppercase">
                    <span>
                      {selectedNeighbourhood === 'All Areas'
                        ? t.allNeighbourhoods
                        : neighbourhoodLabels[language][selectedNeighbourhood]}
                    </span>
                    <span>•</span>
                    <span>
                      {selectedCategory === 'all'
                        ? t.allCategories
                        : categoryLabels[language][selectedCategory]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-label text-[#B38B3F]">
                    [ {filteredRestaurants.length} {language === 'ur' ? 'ریسٹورنٹس' : 'Verified Listings'} ]
                  </span>

                  {/* Reset Filters if applied */}
                  {(selectedNeighbourhood !== 'All Areas' || selectedCategory !== 'all' || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedNeighbourhood('All Areas');
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }}
                      className="text-xs font-editorial-mono uppercase text-[#B38B3F] hover:underline font-bold cursor-pointer"
                    >
                      {language === 'ur' ? 'فلٹرز ختم کریں' : 'Reset Filters'}
                    </button>
                  )}
                </div>
              </div>

              {filteredRestaurants.length === 0 ? (
                <div className="bg-[#F8F7F4] border-[1.5px] border-[#1A1A1A] p-12 text-center text-[#1A1A1A]/60">
                  <Utensils className="w-12 h-12 text-[#1A1A1A]/30 mx-auto mb-3" />
                  <h3 className="font-display text-2xl font-bold text-[#1A1A1A] mb-2">
                    {language === 'ur' ? 'کوئی ریسٹورنٹ نہیں ملا' : 'No Restaurants Matched Your Search'}
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/70 max-w-sm mx-auto mb-4 font-sans">
                    Try clearing the area or cuisine filter to discover more restaurants in Multan.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedNeighbourhood('All Areas');
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="btn-editorial-primary text-xs"
                  >
                    View All Multan Restaurants
                  </button>
                </div>
              ) : (
                <div className="editorial-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredRestaurants.map(restaurant => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onSelect={handleSelectRestaurant}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Restaurant Menu & Detail View */}
        {view === 'restaurant-detail' && selectedRestaurant && (
          <RestaurantDetailView
            restaurant={selectedRestaurant}
            onBack={() => {
              setSelectedRestaurantId(null);
              setView('explore');
            }}
            onOpenCart={() => setIsCartOpen(true)}
            onConflict={handleConflict}
          />
        )}

        {/* Live Customer Order Tracking */}
        {view === 'track-order' && (
          <OrderTrackingView onExplore={() => setView('explore')} />
        )}

        {/* Restaurant Owner Dashboard */}
        {view === 'owner-dashboard' && <RestaurantOwnerDashboard />}

        {/* Admin Directory Dashboard */}
        {view === 'admin-dashboard' && <AdminDashboard />}
      </main>

      {/* Global Modals & Slide-overs */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <SingleRestaurantModal
        pendingItem={conflictModalData?.pendingItem || null}
        conflictingRestaurant={conflictModalData?.conflictingRestaurant || null}
        onClose={() => setConflictModalData(null)}
        onClearAndAdd={handleResolveConflict}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
