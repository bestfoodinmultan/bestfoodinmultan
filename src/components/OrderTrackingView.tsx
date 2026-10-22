import React from 'react';
import { useApp } from '../context/AppContext';
import { translations, statusLabels, neighbourhoodLabels } from '../utils/translations';
import { OrderStatus } from '../types';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Bike,
  PackageCheck,
  MessageCircle,
  Phone,
  ArrowLeft,
  XCircle,
} from 'lucide-react';

const STATUS_STEPS: { key: OrderStatus; labelEn: string; labelUr: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'pending', labelEn: 'Order Received', labelUr: 'آرڈر موصول ہو گیا', icon: Clock },
  { key: 'confirmed', labelEn: 'Restaurant Confirmed', labelUr: 'ریسٹورنٹ نے قبول کیا', icon: CheckCircle2 },
  { key: 'preparing', labelEn: 'In Kitchen / Tandoor', labelUr: 'تندور و باورچی خانے میں تیار', icon: ChefHat },
  { key: 'out_for_delivery', labelEn: 'Rider Out for Delivery', labelUr: 'رائڈر روانہ ہو چکا ہے', icon: Bike },
  { key: 'delivered', labelEn: 'Delivered', labelUr: 'کھانا پہنچ چکا ہے', icon: PackageCheck },
];

export const OrderTrackingView: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const {
    language,
    orders,
    activeOrderId,
    setActiveOrderId,
    restaurants,
  } = useApp();

  const t = translations[language];

  const currentOrder = orders.find(o => o.id === activeOrderId) || orders[0];
  const orderRestaurant = currentOrder
    ? restaurants.find(r => r.id === currentOrder.restaurantId)
    : null;

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStep = currentOrder ? getStepIndex(currentOrder.status) : 0;

  if (!currentOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-[#1A1A1A]">
        <PackageCheck className="w-12 h-12 text-[#1A1A1A]/30 mx-auto mb-3" />
        <h2 className="font-display text-3xl font-bold mb-2">No Active Orders Found</h2>
        <p className="text-xs text-[#1A1A1A]/60 mb-6 font-sans">
          You haven’t placed any orders yet. Explore Multan’s restaurants and order your favorite meal.
        </p>
        <button
          onClick={onExplore}
          className="btn-editorial-primary text-xs"
        >
          {t.backToRestaurants}
        </button>
      </div>
    );
  }

  // Pre-formatted WhatsApp text
  const itemsSummary = currentOrder.items
    .map(i => `${i.quantity}x ${i.menuItem.name}`)
    .join(', ');

  const whatsappMessage = encodeURIComponent(
    `Salam! Regarding my order ${currentOrder.id} at ${currentOrder.restaurantName}:\n` +
    `Items: ${itemsSummary}\n` +
    `Total: PKR ${currentOrder.totalPKR}\n` +
    `Delivery to: ${currentOrder.customerAddress}, ${currentOrder.customerNeighbourhood}\n` +
    `Please share live status.`
  );

  const restaurantWhatsApp = orderRestaurant?.whatsapp || '923001234567';

  return (
    <div className="bg-[#F8F7F4] min-h-screen py-10 text-[#1A1A1A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#1A1A1A]/15">
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-1.5 text-xs font-editorial-mono uppercase font-bold text-[#1A1A1A] hover:text-[#B38B3F] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>[ {t.backToRestaurants} ]</span>
          </button>

          {/* Switch between past orders if any */}
          {orders.length > 1 && (
            <div className="flex items-center gap-2 text-xs font-editorial-mono">
              <span className="text-[#1A1A1A]/60">{language === 'ur' ? 'آرڈرز:' : 'Orders:'}</span>
              <select
                value={currentOrder.id}
                onChange={e => setActiveOrderId(e.target.value)}
                className="bg-white border border-[#1A1A1A]/30 px-2.5 py-1 text-xs font-editorial-mono font-bold focus:outline-none cursor-pointer"
              >
                {orders.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.id} ({statusLabels[language][o.status]})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Live Status Card */}
        <div className="bg-[#F8F7F4] border-[1.5px] border-[#1A1A1A] p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1A1A1A]/15">
            <div>
              <span className="font-label text-[#B38B3F] block mb-1">
                [ {t.orderId}: {currentOrder.id} ]
              </span>
              <h1 className="font-display text-3xl font-bold text-[#1A1A1A]">
                {currentOrder.restaurantName}
              </h1>
              <p className="text-xs font-editorial-mono text-[#1A1A1A]/60 mt-0.5">
                {language === 'ur' ? 'آرڈر کا وقت:' : 'Placed on:'}{' '}
                {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${restaurantWhatsApp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-editorial-primary text-xs py-2 px-3.5 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#B38B3F]" />
                <span>{t.whatsappDirectChat}</span>
              </a>

              {orderRestaurant && (
                <a
                  href={`tel:${orderRestaurant.phone}`}
                  className="pill-editorial text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  <span>{orderRestaurant.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="py-8">
            {currentOrder.status === 'cancelled' ? (
              <div className="border border-rose-300 bg-rose-50 p-4 flex items-center gap-3 text-rose-900 text-xs font-editorial-mono">
                <XCircle className="w-5 h-5 shrink-0 text-rose-700" />
                <span>{t.cancelled} — The restaurant was unable to fulfill this order.</span>
              </div>
            ) : (
              <div className="relative">
                {/* Horizontal Progress Track for desktop */}
                <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-[2px] bg-[#1A1A1A]/15 -translate-y-1/2 z-0" />
                <div
                  className="hidden sm:block absolute top-1/2 left-0 h-[2px] bg-[#B38B3F] -translate-y-1/2 z-0 transition-all duration-500"
                  style={{ width: `${(Math.max(0, currentStep) / (STATUS_STEPS.length - 1)) * 100}%` }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                  {STATUS_STEPS.map((step, idx) => {
                    const isDone = currentStep >= idx;
                    const isCurrent = currentStep === idx;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
                      >
                        <div
                          className={`w-10 h-10 border border-[#1A1A1A] flex items-center justify-center shrink-0 transition-all ${
                            isCurrent
                              ? 'bg-[#1A1A1A] text-white ring-4 ring-[#B38B3F]/30'
                              : isDone
                              ? 'bg-[#B38B3F] text-white'
                              : 'bg-white text-[#1A1A1A]/40'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div>
                          <p
                            className={`text-xs font-editorial-mono uppercase ${
                              isCurrent ? 'font-bold text-[#1A1A1A]' : isDone ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40'
                            }`}
                          >
                            {language === 'ur' ? step.labelUr : step.labelEn}
                          </p>
                          {isCurrent && (
                            <span className="text-[10px] font-editorial-mono font-bold text-[#B38B3F] block">
                              {language === 'ur' ? 'جاری ہے' : 'In Progress'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Delivery Estimate Box */}
          {currentOrder.status !== 'delivered' && currentOrder.status !== 'cancelled' && (
            <div className="bg-[#B38B3F]/10 border border-[#B38B3F]/30 p-4 flex items-center justify-between text-xs font-editorial-mono">
              <div className="flex items-center gap-2 text-[#1A1A1A]">
                <Clock className="w-4 h-4 text-[#B38B3F] shrink-0" />
                <span>
                  {language === 'ur' ? 'متوقع ڈلیوری وقت:' : 'Estimated delivery time:'}{' '}
                  <strong className="text-[#1A1A1A] font-bold">{currentOrder.estimatedDeliveryMins} mins</strong>
                </span>
              </div>
              <span className="text-[11px] text-[#1A1A1A]/60">
                {language === 'ur' ? 'ریسٹورنٹ کی اپنی ڈلیوری سروس' : 'Restaurant-managed delivery'}
              </span>
            </div>
          )}
        </div>

        {/* Order Details & Receipt Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items Summary (2 cols) */}
          <div className="lg:col-span-2 bg-[#F8F7F4] border-[1.5px] border-[#1A1A1A] p-6 shadow-xs">
            <span className="font-label text-[#B38B3F] block mb-1">
              [ Receipt Details ]
            </span>
            <h3 className="font-display text-xl font-bold text-[#1A1A1A] mb-4 pb-3 border-b border-[#1A1A1A]/10">
              {t.orderItems}
            </h3>

            <div className="space-y-4">
              {currentOrder.items.map(item => (
                <div
                  key={item.cartItemId}
                  className="flex items-center justify-between text-xs pb-3 border-b border-[#1A1A1A]/10 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-12 h-12 object-cover bg-white border border-[#1A1A1A]/10"
                    />
                    <div>
                      <h4 className="font-display text-base font-bold text-[#1A1A1A]">
                        {language === 'ur' ? item.menuItem.nameUr : item.menuItem.name}
                      </h4>
                      {item.selectedOptions && (
                        <p className="text-[11px] font-editorial-mono text-[#B38B3F]">
                          {Object.values(item.selectedOptions).join(', ')}
                        </p>
                      )}
                      <p className="text-[#1A1A1A]/60 font-editorial-mono">
                        Qty: {item.quantity} × ₨{item.menuItem.pricePKR + item.selectedOptionsPriceDelta}
                      </p>
                    </div>
                  </div>

                  <span className="font-bold font-editorial-mono text-[#1A1A1A]">
                    ₨{item.itemTotal}
                  </span>
                </div>
              ))}
            </div>

            {/* Special notes */}
            {currentOrder.specialInstructions && (
              <div className="mt-4 p-3 border border-[#1A1A1A]/15 bg-white text-xs text-[#1A1A1A]/80 font-editorial-mono">
                <span className="font-bold text-[#1A1A1A]">
                  {language === 'ur' ? 'خصوصی ہدایات:' : 'Special Note:'}{' '}
                </span>
                {currentOrder.specialInstructions}
              </div>
            )}
          </div>

          {/* Delivery & Billing Address */}
          <div className="bg-[#F8F7F4] border-[1.5px] border-[#1A1A1A] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="font-label text-[#B38B3F] block mb-1">
                [ Destination ]
              </span>
              <h3 className="font-display text-xl font-bold text-[#1A1A1A] mb-4 pb-3 border-b border-[#1A1A1A]/10">
                {language === 'ur' ? 'ڈلیوری کا پتہ اور بل' : 'Delivery & Payment'}
              </h3>

              <div className="space-y-3.5 text-xs mb-6 font-editorial-mono">
                <div>
                  <span className="text-[#1A1A1A]/50 block text-[10px] uppercase font-bold">
                    {language === 'ur' ? 'کسٹمر نام و فون' : 'Recipient'}
                  </span>
                  <div className="font-bold text-[#1A1A1A]">{currentOrder.customerName}</div>
                  <div className="text-[#1A1A1A]/70">{currentOrder.customerPhone}</div>
                </div>

                <div>
                  <span className="text-[#1A1A1A]/50 block text-[10px] uppercase font-bold">
                    {language === 'ur' ? 'ملتان ایڈریس' : 'Address'}
                  </span>
                  <div className="font-bold text-[#B38B3F]">
                    {neighbourhoodLabels[language][currentOrder.customerNeighbourhood]}
                  </div>
                  <div className="text-[#1A1A1A]/80 leading-relaxed font-sans text-xs">
                    {currentOrder.customerAddress}
                  </div>
                </div>

                <div>
                  <span className="text-[#1A1A1A]/50 block text-[10px] uppercase font-bold">
                    {t.paymentMethod}
                  </span>
                  <div className="font-bold text-[#1A1A1A] uppercase">
                    {currentOrder.paymentMethod.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="pt-4 border-t border-[#1A1A1A]/15 space-y-1.5 text-xs font-editorial-mono">
              <div className="flex justify-between text-[#1A1A1A]/70">
                <span>{t.subtotal}</span>
                <span>₨{currentOrder.subtotalPKR}</span>
              </div>
              <div className="flex justify-between text-[#1A1A1A]/70">
                <span>{t.deliveryCharges}</span>
                <span>₨{currentOrder.deliveryFeePKR}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1A1A1A] pt-2 border-t border-[#1A1A1A]/10">
                <span className="font-display text-lg uppercase">{t.total}</span>
                <span className="text-[#1A1A1A] text-xl font-black">₨{currentOrder.totalPKR}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
