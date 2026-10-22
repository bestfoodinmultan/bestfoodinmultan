import React from 'react';
import { MenuItem, Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { AlertCircle, ShoppingBag, X } from 'lucide-react';

interface SingleRestaurantModalProps {
  pendingItem: MenuItem | null;
  conflictingRestaurant: Restaurant | null;
  onClose: () => void;
  onClearAndAdd: () => void;
}

export const SingleRestaurantModal: React.FC<SingleRestaurantModalProps> = ({
  pendingItem,
  conflictingRestaurant,
  onClose,
  onClearAndAdd,
}) => {
  const { language } = useApp();
  const t = translations[language];

  if (!pendingItem || !conflictingRestaurant) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#F8F7F4] text-[#1A1A1A] border-[1.5px] border-[#1A1A1A] max-w-md w-full p-6 sm:p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-10 h-10 border border-[#1A1A1A] bg-[#B38B3F]/15 flex items-center justify-center text-[#B38B3F] shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <span className="font-label text-[#B38B3F] block mb-1">
          [ Kitchen Policy Notice ]
        </span>
        <h3 className="font-display text-2xl font-bold text-[#1A1A1A] mb-2 leading-tight">
          {language === 'ur'
            ? 'آرڈر صرف ایک ریسٹورنٹ سے ممکن ہے'
            : 'Order from One Kitchen at a Time'}
        </h3>

        <p className="text-xs text-[#1A1A1A]/70 leading-relaxed mb-4 font-sans">
          {language === 'ur' ? (
            <>
              آپ کی باسکٹ میں پہلے سے <strong className="text-[#1A1A1A] font-bold">{conflictingRestaurant.nameUr}</strong> کے کھانے موجود ہیں۔ چونکہ ہر ریسٹورنٹ اپنی ڈلیوری خود سنبھالتا ہے، آپ ایک وقت میں صرف ایک ہی جگہ سے آرڈر کر سکتے ہیں۔
            </>
          ) : (
            <>
              Your cart currently contains items from <strong className="text-[#1A1A1A] font-bold">{conflictingRestaurant.name}</strong>. Because each restaurant manages its own kitchen and rider delivery, you can only order from one restaurant per checkout.
            </>
          )}
        </p>

        <div className="bg-white p-3.5 border border-[#1A1A1A]/20 mb-6 flex items-center gap-3 font-editorial-mono">
          <ShoppingBag className="w-4 h-4 text-[#B38B3F] shrink-0" />
          <div className="text-xs text-[#1A1A1A]">
            {language === 'ur'
              ? `باسکٹ خالی کر کے ${pendingItem.nameUr} شامل کریں؟`
              : `Clear existing cart and add "${pendingItem.name}"?`}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="btn-editorial-secondary flex-1 text-xs py-2.5 text-center"
          >
            {t.cancel}
          </button>
          <button
            onClick={onClearAndAdd}
            className="btn-editorial-primary flex-1 text-xs py-2.5 text-center"
          >
            {t.clearCartAndSwitch}
          </button>
        </div>
      </div>
    </div>
  );
};
