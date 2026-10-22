import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations, neighbourhoodLabels } from '../utils/translations';
import { MultanNeighbourhood } from '../types';
import { X, CreditCard, Banknote, ShieldCheck } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    language,
    cart,
    cartRestaurantId,
    restaurants,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    createOrder,
  } = useApp();

  const t = translations[language];
  const activeRestaurant = restaurants.find(r => r.id === cartRestaurantId);

  const [fullName, setFullName] = useState('Muhammad Nadeem');
  const [phone, setPhone] = useState('0300 1234567');
  const [email, setEmail] = useState('muhammadnadeemwebdeveloper@gmail.com');
  const [neighbourhood, setNeighbourhood] = useState<MultanNeighbourhood>(
    activeRestaurant ? activeRestaurant.neighbourhood : 'Gulgasht Colony'
  );
  const [address, setAddress] = useState('House 18-B, Street 4, near Gol Bagh, Gulgasht Colony');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !activeRestaurant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      createOrder({
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email,
        customerNeighbourhood: neighbourhood,
        customerAddress: address,
        restaurantId: activeRestaurant.id,
        restaurantName: activeRestaurant.name,
        items: [...cart],
        subtotalPKR: cartSubtotal,
        deliveryFeePKR: cartDeliveryFee,
        totalPKR: cartTotal,
        paymentMethod,
        specialInstructions,
        estimatedDeliveryMins: activeRestaurant.deliveryTimeMax || 40,
      });

      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#F8F7F4] text-[#1A1A1A] border-[1.5px] border-[#1A1A1A] max-w-xl w-full p-6 sm:p-8 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1A1A1A]/15">
          <div>
            <span className="font-label text-[#B38B3F] block mb-1">
              [ Multan Dispatch Details ]
            </span>
            <h3 className="font-display text-2xl font-bold text-[#1A1A1A]">
              {t.customerDetails}
            </h3>
            <p className="text-xs text-[#1A1A1A]/60 font-editorial-mono">
              {language === 'ur' ? 'آرڈر براہِ راست ریسٹورنٹ کو بھیجا جا رہا ہے' : `Direct Kitchen: ${activeRestaurant.name}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-editorial-mono uppercase font-bold text-[#1A1A1A] mb-1">
                {t.fullName} *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Muhammad Nadeem"
                className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/30 focus:border-[#1A1A1A] bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-editorial-mono uppercase font-bold text-[#1A1A1A] mb-1">
                {t.phone} (WhatsApp) *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/30 focus:border-[#1A1A1A] bg-white focus:outline-none font-editorial-mono"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-editorial-mono uppercase font-bold text-[#1A1A1A] mb-1">
              {t.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/30 focus:border-[#1A1A1A] bg-white focus:outline-none font-editorial-mono"
            />
          </div>

          {/* Multan Neighbourhood */}
          <div>
            <label className="block text-xs font-editorial-mono uppercase font-bold text-[#1A1A1A] mb-1">
              {t.selectArea} *
            </label>
            <div className="relative">
              <select
                value={neighbourhood}
                onChange={e => setNeighbourhood(e.target.value as MultanNeighbourhood)}
                className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/30 focus:border-[#1A1A1A] bg-white focus:outline-none cursor-pointer font-editorial-mono font-bold uppercase"
              >
                {Object.keys(neighbourhoodLabels.en)
                  .filter(k => k !== 'All Areas')
                  .map(key => (
                    <option key={key} value={key}>
                      {neighbourhoodLabels[language][key as MultanNeighbourhood]}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-xs font-editorial-mono uppercase font-bold text-[#1A1A1A] mb-1">
              {t.streetAddress} *
            </label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder={t.streetAddressPlaceholder}
              className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/30 focus:border-[#1A1A1A] bg-white focus:outline-none"
            />
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-editorial-mono uppercase font-bold text-[#1A1A1A] mb-1">
              {t.specialInstructions}
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              placeholder={t.specialInstructionsPlaceholder}
              className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/30 focus:border-[#1A1A1A] bg-white focus:outline-none"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-editorial-mono uppercase font-bold text-[#1A1A1A] mb-1.5">
              {t.paymentMethod}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 border text-left flex items-center gap-2 cursor-pointer transition-all font-editorial-mono ${
                  paymentMethod === 'cod'
                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white font-bold'
                    : 'border-[#1A1A1A]/30 hover:bg-[#1A1A1A]/5 text-[#1A1A1A]'
                }`}
              >
                <Banknote className="w-4 h-4 text-[#B38B3F] shrink-0" />
                <span className="truncate">{t.cod}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('jazzcash')}
                className={`p-3 border text-left flex items-center gap-2 cursor-pointer transition-all font-editorial-mono ${
                  paymentMethod === 'jazzcash'
                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white font-bold'
                    : 'border-[#1A1A1A]/30 hover:bg-[#1A1A1A]/5 text-[#1A1A1A]'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#B38B3F] shrink-0" />
                <span className="truncate">{t.jazzcash}</span>
              </button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-white p-4 border border-[#1A1A1A]/15 space-y-1.5 text-xs font-editorial-mono">
            <div className="flex justify-between text-[#1A1A1A]/70">
              <span>{t.subtotal} ({cart.length} items)</span>
              <span>₨{cartSubtotal}</span>
            </div>
            <div className="flex justify-between text-[#1A1A1A]/70">
              <span>{t.deliveryCharges} ({activeRestaurant.neighbourhood})</span>
              <span>₨{cartDeliveryFee}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#1A1A1A] pt-2 border-t border-[#1A1A1A]/10">
              <span className="font-display text-lg">{t.total}</span>
              <span className="text-xl font-bold font-editorial-mono">₨{cartTotal}</span>
            </div>
          </div>

          {/* Direct Restaurant Delivery Notice */}
          <div className="flex items-center gap-2 text-[11px] font-editorial-mono text-[#1B4332]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              {language === 'ur'
                ? 'کھانا ریسٹورنٹ کے اپنے رائڈر کے ذریعے گرم اور محفوظ پہنچایا جاتا ہے۔'
                : 'Direct kitchen delivery ensures fresh local preparation.'}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-editorial-primary py-3.5 text-xs text-center cursor-pointer shadow-sm disabled:opacity-40"
          >
            {isSubmitting ? (
              <span>Transmitting to Kitchen...</span>
            ) : (
              <span>{t.confirmOrder} (₨{cartTotal})</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
