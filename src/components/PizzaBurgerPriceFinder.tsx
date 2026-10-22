import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { translations, neighbourhoodLabels } from '../utils/translations';
import { MenuItem, Restaurant, MultanNeighbourhood, PizzaSize, BurgerType } from '../types';
import {
  Search,
  Phone,
  MessageCircle,
  RotateCcw,
  Clock,
  ArrowUpDown,
  Flame,
  BadgeCheck,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface PizzaBurgerPriceFinderProps {
  onSelectItem?: (item: MenuItem, restaurant: Restaurant) => void;
  onSelectRestaurant?: (restaurant: Restaurant) => void;
}

export const PizzaBurgerPriceFinder: React.FC<PizzaBurgerPriceFinderProps> = ({
  onSelectItem,
  onSelectRestaurant,
}) => {
  const {
    language,
    menuItems,
    restaurants,
    setSelectedRestaurantId,
    setView,
    addToCart,
  } = useApp();

  const t = translations[language];

  // Search & Filter States
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pizza' | 'burgers'>('all');
  const [minPrice, setMinPrice] = useState<number>(200);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [selectedArea, setSelectedArea] = useState<MultanNeighbourhood | 'All Areas'>('All Areas');
  const [selectedPizzaSize, setSelectedPizzaSize] = useState<PizzaSize | 'all'>('all');
  const [selectedBurgerType, setSelectedBurgerType] = useState<BurgerType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'prep_time'>('price_asc');
  const [dealsOnly, setDealsOnly] = useState<boolean>(false);
  const [activeBudgetPreset, setActiveBudgetPreset] = useState<string>('custom');

  // Quick budget presets
  const budgetPresets = [
    { id: 'all', label: language === 'ur' ? 'تمام' : 'All', min: 150, max: 4000 },
    { id: 'under500', label: language === 'ur' ? '< 500' : 'Under Rs. 500', min: 150, max: 500 },
    { id: '500to1000', label: 'Rs. 500–1K', min: 500, max: 1000 },
    { id: '1000to2000', label: 'Rs. 1K–2K', min: 1000, max: 2000 },
    { id: 'family2000', label: language === 'ur' ? '2000+ فیملی' : 'Rs. 2000+ Family', min: 2000, max: 4500 },
  ];

  const handleApplyPreset = (preset: typeof budgetPresets[0]) => {
    setActiveBudgetPreset(preset.id);
    setMinPrice(preset.min);
    setMaxPrice(preset.max);
  };

  const handleMinSliderChange = (val: number) => {
    setActiveBudgetPreset('custom');
    if (val > maxPrice) {
      setMinPrice(maxPrice);
    } else {
      setMinPrice(val);
    }
  };

  const handleMaxSliderChange = (val: number) => {
    setActiveBudgetPreset('custom');
    if (val < minPrice) {
      setMaxPrice(minPrice);
    } else {
      setMaxPrice(val);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setMinPrice(200);
    setMaxPrice(1500);
    setSelectedArea('All Areas');
    setSelectedPizzaSize('all');
    setSelectedBurgerType('all');
    setSearchQuery('');
    setSortBy('price_asc');
    setDealsOnly(false);
    setActiveBudgetPreset('custom');
  };

  const restaurantMap = useMemo(() => {
    const map = new Map<string, Restaurant>();
    restaurants.forEach(r => map.set(r.id, r));
    return map;
  }, [restaurants]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const isPizza =
        item.category === 'pizza' ||
        item.name.toLowerCase().includes('pizza') ||
        item.name.toLowerCase().includes('slice') ||
        item.description.toLowerCase().includes('pizza');
      const isBurger =
        item.category === 'burgers' ||
        item.name.toLowerCase().includes('burger') ||
        item.name.toLowerCase().includes('zinger') ||
        item.name.toLowerCase().includes('bun kabab') ||
        item.description.toLowerCase().includes('burger');

      if (!isPizza && !isBurger) return false;

      if (selectedCategory === 'pizza' && !isPizza) return false;
      if (selectedCategory === 'burgers' && !isBurger) return false;

      if (item.pricePKR < minPrice || item.pricePKR > maxPrice) return false;

      if (dealsOnly && !item.dealBadge && !item.originalPricePKR && item.category !== 'deals') {
        return false;
      }

      const rest = restaurantMap.get(item.restaurantId);
      if (selectedArea !== 'All Areas') {
        if (!rest || rest.neighbourhood !== selectedArea) return false;
      }

      if (selectedPizzaSize !== 'all' && isPizza) {
        if (item.pizzaSize && item.pizzaSize !== selectedPizzaSize) return false;
      }

      if (selectedBurgerType !== 'all' && isBurger) {
        if (item.burgerType && item.burgerType !== selectedBurgerType) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const restName = rest?.name.toLowerCase() || '';
        const restNameUr = rest?.nameUr || '';
        const matchName =
          item.name.toLowerCase().includes(q) ||
          item.nameUr.includes(q) ||
          item.description.toLowerCase().includes(q) ||
          restName.includes(q) ||
          restNameUr.includes(q);
        if (!matchName) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') {
        return a.pricePKR - b.pricePKR;
      } else if (sortBy === 'price_desc') {
        return b.pricePKR - a.pricePKR;
      } else if (sortBy === 'prep_time') {
        return a.preparationTimeMin - b.preparationTimeMin;
      } else if (sortBy === 'rating') {
        const ratingA = restaurantMap.get(a.restaurantId)?.rating || 0;
        const ratingB = restaurantMap.get(b.restaurantId)?.rating || 0;
        return ratingB - ratingA;
      }
      return 0;
    });
  }, [
    menuItems,
    selectedCategory,
    minPrice,
    maxPrice,
    dealsOnly,
    selectedArea,
    selectedPizzaSize,
    selectedBurgerType,
    searchQuery,
    sortBy,
    restaurantMap,
  ]);

  const handleViewRestaurant = (rest: Restaurant) => {
    if (onSelectRestaurant) {
      onSelectRestaurant(rest);
    } else {
      setSelectedRestaurantId(rest.id);
      setView('restaurant-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOrderDirect = (item: MenuItem, rest: Restaurant) => {
    if (onSelectItem) {
      onSelectItem(item, rest);
    } else {
      addToCart(item, 1);
    }
  };

  return (
    <section
      id="pizza-burger-finder"
      className="bg-[#1B4332] text-white border-b-[1.5px] border-[#1A1A1A] py-12 sm:py-16 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* =========================================================================
              LEFT COLUMN: FINDER CONTROLS (Matching Variation 2 .finder-controls)
             ========================================================================= */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <span className="font-label text-[#B38B3F] block mb-2">
                [ {language === 'ur' ? 'پرائس فائنڈر' : 'Price Finder • Budget Engine'} ]
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold leading-[0.95] text-white tracking-tight">
                {language === 'ur' ? 'لائیو بجٹ سرچ' : 'Live Budget Search'}
              </h2>
              <p className="text-xs sm:text-sm text-white/70 mt-2 font-sans leading-relaxed">
                {language === 'ur'
                  ? 'ملتان میں اپنے بجٹ کے مطابق پیزا اور برگر تلاش کریں۔'
                  : 'Compare verified menu rates across Multan’s top pizzerias and burger joints.'}
              </p>
            </div>

            {/* Control Group 1: Category Selector */}
            <div className="border-t border-white/20 pt-4">
              <span className="font-label text-[#B38B3F] block mb-2.5">
                {language === 'ur' ? 'کیٹیگری منتخب کریں' : 'Choose Category'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`py-2 px-2 text-xs font-editorial-mono uppercase font-bold text-center border transition-all cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-[#B38B3F] text-[#1A1A1A] border-[#B38B3F]'
                      : 'bg-transparent text-white border-white/30 hover:border-white'
                  }`}
                >
                  {language === 'ur' ? 'تمام' : 'All'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('pizza')}
                  className={`py-2 px-2 text-xs font-editorial-mono uppercase font-bold text-center border transition-all cursor-pointer ${
                    selectedCategory === 'pizza'
                      ? 'bg-[#B38B3F] text-[#1A1A1A] border-[#B38B3F]'
                      : 'bg-transparent text-white border-white/30 hover:border-white'
                  }`}
                >
                  Pizza
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('burgers')}
                  className={`py-2 px-2 text-xs font-editorial-mono uppercase font-bold text-center border transition-all cursor-pointer ${
                    selectedCategory === 'burgers'
                      ? 'bg-[#B38B3F] text-[#1A1A1A] border-[#B38B3F]'
                      : 'bg-transparent text-white border-white/30 hover:border-white'
                  }`}
                >
                  Burger
                </button>
              </div>
            </div>

            {/* Control Group 2: Quick Budget Presets */}
            <div className="border-t border-white/20 pt-4">
              <span className="font-label text-[#B38B3F] block mb-2.5">
                {t.quickBudgets}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {budgetPresets.map(preset => {
                  const isActive = activeBudgetPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`text-[10px] font-editorial-mono uppercase tracking-wider px-2.5 py-1.5 border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#1B4332] font-bold border-white'
                          : 'bg-transparent text-white/80 border-white/25 hover:border-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Control Group 3: Minimum Price Slider */}
            <div className="border-t border-white/20 pt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-label text-[#B38B3F]">{t.minPrice}</span>
                <span className="font-editorial-mono font-bold text-sm text-white">
                  Rs. {minPrice}
                </span>
              </div>
              <input
                type="range"
                min={150}
                max={4000}
                step={50}
                value={minPrice}
                onChange={e => handleMinSliderChange(Number(e.target.value))}
                className="w-full accent-[#B38B3F] cursor-pointer h-1.5 bg-white/20 rounded-none"
              />
              <div className="flex justify-between text-[10px] font-editorial-mono text-white/50 mt-1">
                <span>Rs. 150</span>
                <span>Rs. 4,000</span>
              </div>
            </div>

            {/* Control Group 4: Maximum Price Slider */}
            <div className="border-t border-white/20 pt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-label text-[#B38B3F]">{t.maxPrice}</span>
                <span className="font-editorial-mono font-bold text-sm text-white">
                  Rs. {maxPrice}
                </span>
              </div>
              <input
                type="range"
                min={150}
                max={5000}
                step={50}
                value={maxPrice}
                onChange={e => handleMaxSliderChange(Number(e.target.value))}
                className="w-full accent-[#B38B3F] cursor-pointer h-1.5 bg-white/20 rounded-none"
              />
              <div className="flex justify-between text-[10px] font-editorial-mono text-white/50 mt-1">
                <span>Rs. 150</span>
                <span>Rs. 5,000</span>
              </div>
            </div>

            {/* Control Group 5: Multan Area & Sub-Filters */}
            <div className="border-t border-white/20 pt-4 space-y-3">
              <div>
                <span className="font-label text-[#B38B3F] block mb-1">
                  {t.multanAreaLabel}
                </span>
                <select
                  value={selectedArea}
                  onChange={e => setSelectedArea(e.target.value as any)}
                  className="w-full p-2.5 bg-[#1B4332] text-white border border-white/30 text-xs font-editorial-mono uppercase focus:outline-none focus:border-white"
                >
                  <option value="All Areas" className="bg-[#1B4332] text-white">{t.allNeighbourhoods}</option>
                  <option value="Gulgasht Colony" className="bg-[#1B4332] text-white">{neighbourhoodLabels[language]['Gulgasht Colony']}</option>
                  <option value="Bosan Road" className="bg-[#1B4332] text-white">{neighbourhoodLabels[language]['Bosan Road']}</option>
                  <option value="Multan Cantt" className="bg-[#1B4332] text-white">{neighbourhoodLabels[language]['Multan Cantt']}</option>
                  <option value="Chowk Kutchery" className="bg-[#1B4332] text-white">{neighbourhoodLabels[language]['Chowk Kutchery']}</option>
                  <option value="Shah Rukn-e-Alam Colony" className="bg-[#1B4332] text-white">{neighbourhoodLabels[language]['Shah Rukn-e-Alam Colony']}</option>
                  <option value="Northern Bypass" className="bg-[#1B4332] text-white">{neighbourhoodLabels[language]['Northern Bypass']}</option>
                </select>
              </div>

              {/* Keyword Search within Price Finder */}
              <div>
                <span className="font-label text-[#B38B3F] block mb-1">
                  {language === 'ur' ? 'کھانے کا نام' : 'Search Item'}
                </span>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={t.searchFoodPlaceholder}
                    className="w-full p-2.5 bg-transparent text-white border border-white/30 text-xs font-sans placeholder-white/40 focus:outline-none focus:border-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Sort By & Deals Only */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex-1">
                  <span className="font-label text-[#B38B3F] block mb-1">{t.sortByLabel}</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="w-full p-2 bg-[#1B4332] text-white border border-white/30 text-[11px] font-editorial-mono focus:outline-none"
                  >
                    <option value="price_asc" className="bg-[#1B4332] text-white">{t.sortLowToHigh}</option>
                    <option value="price_desc" className="bg-[#1B4332] text-white">{t.sortHighToLow}</option>
                    <option value="rating" className="bg-[#1B4332] text-white">{t.sortTopRated}</option>
                    <option value="prep_time" className="bg-[#1B4332] text-white">{t.sortFastPrep}</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-4 text-xs font-editorial-mono uppercase">
                  <input
                    type="checkbox"
                    checked={dealsOnly}
                    onChange={e => setDealsOnly(e.target.checked)}
                    className="accent-[#B38B3F] w-3.5 h-3.5"
                  />
                  <span>Deals</span>
                </label>
              </div>
            </div>

            {/* Clear All Filters */}
            <div className="border-t border-white/20 pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-editorial-mono uppercase tracking-wider text-white/70 hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.clearFilters}</span>
              </button>
              <span className="text-[11px] font-editorial-mono text-[#B38B3F]">
                Rs. {minPrice}–{maxPrice}
              </span>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: EDITORIAL GRID RESULTS (Matching Variation 2 .grid-container)
             ========================================================================= */}
          <div className="lg:col-span-8">
            {filteredItems.length > 0 ? (
              <div className="editorial-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {/* Stat Card Spanning 2 Columns (Direct from Variation 2) */}
                <div className="bg-[#F8F7F4] text-[#1A1A1A] p-6 sm:p-8 flex flex-col justify-center sm:col-span-2 border-b-[1.5px] border-[#1A1A1A]">
                  <div className="font-display text-5xl sm:text-6xl font-bold text-[#B38B3F] leading-none mb-1">
                    {filteredItems.length}
                  </div>
                  <span className="font-label text-[#1A1A1A]">
                    [ {language === 'ur' ? 'آپ کے بجٹ میں مصدقہ کھانے' : 'Verified Items in Budget' } • Rs. {minPrice} – Rs. {maxPrice} ]
                  </span>
                  <p className="text-xs text-[#1A1A1A]/70 mt-2 max-w-md">
                    {language === 'ur'
                      ? 'ملتان کے تصدیق شدہ ریسٹورنٹس سے براہ راست مینو ریٹس اور ڈلیوری کے ساتھ۔'
                      : 'Real-time verified pricing from authentic kitchens across Gulgasht, Bosan Road, Cantt & Old City.'}
                  </p>
                </div>

                {/* Additional Quick Action / Info Box */}
                <div className="bg-[#F8F7F4] text-[#1A1A1A] p-6 flex flex-col justify-between border-b-[1.5px] border-[#1A1A1A] hidden xl:flex">
                  <div>
                    <span className="font-label text-[#1B4332] block mb-1">
                      [ Ordering Model ]
                    </span>
                    <h4 className="font-display text-lg font-bold text-[#1A1A1A] leading-snug">
                      Kitchen Direct Delivery
                    </h4>
                    <p className="text-[11px] text-[#1A1A1A]/60 mt-1">
                      Orders route straight to restaurant counter staff for hot preparation.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#1A1A1A]/10 text-[10px] font-editorial-mono uppercase text-[#B38B3F]">
                    COD & JazzCash Accepted
                  </div>
                </div>

                {/* Individual Food Cards (Matching Variation 2 .card) */}
                {filteredItems.map(item => {
                  const rest = restaurantMap.get(item.restaurantId);
                  const isPizza =
                    item.category === 'pizza' ||
                    item.name.toLowerCase().includes('pizza') ||
                    item.name.toLowerCase().includes('slice');

                  return (
                    <div
                      key={item.id}
                      className="bg-[#F8F7F4] text-[#1A1A1A] p-5 flex flex-col justify-between transition-colors hover:bg-white"
                    >
                      <div>
                        {/* Image */}
                        <div className="relative aspect-[4/3] w-full bg-[#1A1A1A]/10 overflow-hidden mb-3 border border-[#1A1A1A]/10">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-300"
                          />
                          {item.dealBadge && (
                            <div className="absolute top-2 left-2 bg-[#1B4332] text-white text-[9px] font-editorial-mono uppercase px-2 py-0.5 tracking-wider font-bold">
                              {item.dealBadge}
                            </div>
                          )}
                          <div className="absolute bottom-2 right-2 bg-[#1A1A1A]/85 text-white text-[10px] font-editorial-mono px-2 py-0.5">
                            {item.preparationTimeMin}m
                          </div>
                        </div>

                        {/* Space Mono Metadata Line: Rs. • Area • Brand */}
                        <div className="flex items-center justify-between text-[11px] font-editorial-mono font-bold text-[#B38B3F] mb-1.5">
                          <span className="text-[#1A1A1A] text-sm">
                            Rs. {item.pricePKR}
                          </span>
                          <span className="text-[#1A1A1A]/60 font-normal">
                            {rest?.neighbourhood || 'Multan'}
                          </span>
                        </div>

                        {/* Title (Cormorant Garamond) */}
                        <h3 className="font-display text-lg font-bold text-[#1A1A1A] leading-snug mb-1">
                          {language === 'ur' ? item.nameUr : item.name}
                        </h3>

                        {/* Restaurant Subtitle */}
                        {rest && (
                          <div className="text-[11px] font-editorial-mono uppercase tracking-wider text-[#1B4332] font-bold mb-2">
                            {language === 'ur' ? rest.nameUr : rest.name}
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-xs text-[#1A1A1A]/65 line-clamp-2 leading-relaxed mb-4 font-sans">
                          {language === 'ur' ? item.descriptionUr : item.description}
                        </p>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-[#1A1A1A]/10 flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => rest && handleOrderDirect(item, rest)}
                            className="btn-editorial-primary flex-1 flex items-center justify-center gap-1.5 text-[10px]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{t.addToCart}</span>
                          </button>

                          {rest && (
                            <button
                              type="button"
                              onClick={() => handleViewRestaurant(rest)}
                              className="btn-editorial-secondary p-2 flex items-center justify-center"
                              title={t.viewMenu}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {rest && (
                          <div className="flex items-center justify-between text-[10px] font-editorial-mono text-[#1A1A1A]/60 pt-1">
                            <span className="truncate max-w-[120px]">{rest.address.split(',')[0]}</span>
                            <div className="flex items-center gap-2">
                              {rest.phone && (
                                <a
                                  href={`tel:${rest.phone}`}
                                  className="text-[#1A1A1A] hover:text-[#B38B3F]"
                                  title={t.callNow}
                                >
                                  Call
                                </a>
                              )}
                              {rest.whatsapp && (
                                <a
                                  href={`https://wa.me/${rest.whatsapp}?text=${encodeURIComponent(
                                    `Salam, I want to order ${item.name} (Rs. ${item.pricePKR}) from your Multan branch.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#1B4332] font-bold hover:underline"
                                >
                                  WhatsApp
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State matching Variation 2 */
              <div className="bg-[#F8F7F4] text-[#1A1A1A] border-[1.5px] border-[#1A1A1A] p-10 sm:p-14 text-center">
                <span className="font-label text-[#B38B3F] block mb-2">
                  [ No Matches In Current Filter ]
                </span>
                <h3 className="font-display text-3xl font-bold text-[#1A1A1A] mb-3">
                  {t.noItemsFoundTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#1A1A1A]/70 max-w-md mx-auto mb-6">
                  {language === 'ur'
                    ? `Rs. ${minPrice} سے Rs. ${maxPrice} کے درمیان کوئی آئٹم نہیں ملا۔ بجٹ کا دائرہ بڑھائیں یا فلٹرز ری سیٹ کریں۔`
                    : `No pizzas or burgers found in the Rs. ${minPrice} – Rs. ${maxPrice} range. Try adjusting the price slider or resetting filters.`}
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="btn-editorial-primary text-xs"
                  >
                    {t.resetBudget}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(150);
                      setMaxPrice(4000);
                      setSelectedArea('All Areas');
                    }}
                    className="btn-editorial-secondary text-xs"
                  >
                    Expand to Rs. 150 – 4,000
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
