import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
  const {
    language,
    cart,
    cartRestaurantId,
    restaurants,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
  } = useApp();

  const t = translations[language];
  const activeRestaurant = restaurants.find(r => r.id === cartRestaurantId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div
        className={`fixed inset-y-0 ${
          language === 'ur' ? 'left-0' : 'right-0'
        } max-w-full flex pl-10`}
      >
        <div className="w-screen max-w-md bg-[#F8F7F4] text-[#1A1A1A] border-l-[1.5px] border-[#1A1A1A] shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b-[1.5px] border-[#1A1A1A] flex items-center justify-between bg-[#F8F7F4]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B38B3F]" />
              <h2 className="font-display text-xl font-bold text-[#1A1A1A]">
                {t.cart} ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Restaurant Banner if items present */}
          {activeRestaurant && (
            <div className="bg-[#B38B3F]/10 px-5 py-2.5 border-b border-[#1A1A1A]/10 flex items-center justify-between text-xs font-editorial-mono">
              <div>
                <span className="text-[#1A1A1A]/60 font-normal">
                  {language === 'ur' ? 'آرڈر بذریعہ:' : 'Kitchen:'}
                </span>{' '}
                <strong className="text-[#1A1A1A] font-bold">
                  {language === 'ur' ? activeRestaurant.nameUr : activeRestaurant.name}
                </strong>
              </div>
              <button
                onClick={clearCart}
                className="text-[#1A1A1A]/70 hover:text-rose-600 font-bold uppercase underline cursor-pointer"
                title="Clear Cart"
              >
                {language === 'ur' ? 'خالی کریں' : 'Clear'}
              </button>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#1A1A1A]/40">
                <ShoppingBag className="w-12 h-12 text-[#1A1A1A]/20 mb-3" />
                <h3 className="font-display text-2xl font-bold text-[#1A1A1A] mb-1">{t.cartEmpty}</h3>
                <p className="text-xs text-[#1A1A1A]/60 max-w-xs leading-relaxed font-sans">
                  {t.cartEmptyDesc}
                </p>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.cartItemId}
                  className="flex gap-3 pb-4 border-b border-[#1A1A1A]/10 items-start justify-between"
                >
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-16 h-16 object-cover shrink-0 bg-[#1A1A1A]/10 border border-[#1A1A1A]/10"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-base font-bold text-[#1A1A1A] truncate">
                      {language === 'ur' ? item.menuItem.nameUr : item.menuItem.name}
                    </h4>

                    {item.selectedOptions && (
                      <div className="text-[11px] font-editorial-mono text-[#B38B3F] truncate">
                        {Object.values(item.selectedOptions).join(', ')}
                      </div>
                    )}

                    <div className="text-xs text-[#1A1A1A]/60 mt-0.5 font-editorial-mono">
                      ₨{item.menuItem.pricePKR + item.selectedOptionsPriceDelta} × {item.quantity}
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-[#1A1A1A] bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, -1)}
                          className="w-6 h-6 flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A]/10 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold font-editorial-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 flex items-center justify-center bg-[#1A1A1A] text-white hover:bg-[#B38B3F] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[#1A1A1A]/40 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold font-editorial-mono text-[#1A1A1A]">
                      ₨{item.itemTotal}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Calculations */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 border-t-[1.5px] border-[#1A1A1A] bg-white space-y-4">
              <div className="space-y-1.5 text-xs font-editorial-mono">
                <div className="flex items-center justify-between text-[#1A1A1A]/70">
                  <span>{t.subtotal}</span>
                  <span className="font-bold">₨{cartSubtotal}</span>
                </div>
                <div className="flex items-center justify-between text-[#1A1A1A]/70">
                  <span>{t.deliveryCharges}</span>
                  <span className="font-bold">₨{cartDeliveryFee}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-[#1A1A1A] pt-2 border-t border-[#1A1A1A]/15">
                  <span className="font-display text-lg uppercase">{t.total}</span>
                  <span className="text-[#1A1A1A] text-xl font-editorial-mono font-black">
                    ₨{cartTotal}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full btn-editorial-primary py-3.5 flex items-center justify-center gap-2 text-xs"
              >
                <span>{t.checkout}</span>
                {language === 'ur' ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
