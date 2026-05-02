"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import MapPicker from "@/components/map/MapPicker";
import SuccessModal from "@/components/checkout/SuccessModal";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Make sure to set NEXT_PUBLIC_STRIPE_PUBLIC_KEY in .env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_dummy");

const CheckoutForm = ({ clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      toast.error(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="p-4 border border-gallery-border bg-white mb-6">
        <CardElement options={{
          hidePostalCode: true,
          style: {
            base: {
              fontSize: '16px',
              color: '#1A1A1A',
              '::placeholder': { color: '#6B7280' }
            }
          }
        }} />
      </div>
      <button
        disabled={isProcessing || !stripe}
        className="w-full py-4 bg-gallery-primary text-white text-lg rounded hover:bg-black transition-colors disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState({ lat: 23.8103, lng: 90.4125 });
  const [paymentMethod, setPaymentMethod] = useState("Card");

  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 🎟️ Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    }
    if (!showSuccess && items.length === 0) {
      router.push("/cart");
    }
  }, [user, items, router, showSuccess]);

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setIsApplyingCoupon(true);
    try {
      const { data } = await api.post("/promotions/validate", { code: couponInput });
      setAppliedCoupon(data);
      toast.success(`Coupon "${data.code}" applied!`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid coupon code");
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getTotal();
    if (appliedCoupon.discount.includes("%")) {
      const percentage = parseFloat(appliedCoupon.discount.replace("%", ""));
      return (subtotal * percentage) / 100;
    } else {
      return parseFloat(appliedCoupon.discount.replace(/[^0-9.]/g, ""));
    }
  };

  const getFinalTotal = () => {
    return getTotal() - getDiscountAmount();
  };

  const placeOrder = async () => {
    if (!address || !city || !postalCode || !country || !phone) {
      toast.error("Please fill in all address and contact fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        orderItems: items.map(i => ({
          product: i.product._id,
          title: i.product.title,
          quantity: i.quantity,
          price: i.product.price,
          imageUrl: i.product.imageUrl
        })),
        shippingAddress: { address, city, postalCode, country, phone, location },
        paymentMethod,
        itemsPrice: getTotal(),
        shippingPrice: 0,
        discountPrice: getDiscountAmount(),
        couponCode: appliedCoupon?.code || "",
        totalPrice: getFinalTotal(),
      };

      const { data } = await api.post("/orders", orderData);
      setOrderId(data.order._id);

      if (paymentMethod === "Card") {
        setClientSecret(data.clientSecret);
      } else {
        handleSuccess();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Error placing order";
      toast.error(errorMsg);
      setIsSubmitting(false);
    }
  };

  const handleSuccess = () => {
    clearCart();
    setShowSuccess(true);
  };

  if ((!showSuccess && items.length === 0) || !user) return null;

  return (
    <div className="min-h-screen bg-gallery-bg py-8 sm:py-12">
      <SuccessModal 
        isOpen={showSuccess} 
        orderId={orderId} 
        onClose={() => router.push("/dashboard")} 
      />
      <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-8 sm:gap-12">

        {/* Left Col - Details */}
        <div className="w-full lg:w-2/3 space-y-6 sm:space-y-8">

          <div className="bg-gallery-surface border border-gallery-border p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-extralight text-gallery-text mb-6 border-b border-gallery-border pb-4 uppercase tracking-widest">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <input
                type="text" placeholder="STREET ADDRESS" value={address} onChange={e => setAddress(e.target.value)}
                className="col-span-1 md:col-span-2 w-full h-14 px-6 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold bg-gallery-soft/30 text-xs tracking-widest uppercase font-black"
              />
              <input
                type="text" placeholder="CITY" value={city} onChange={e => setCity(e.target.value)}
                className="w-full h-14 px-6 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold bg-gallery-soft/30 text-xs tracking-widest uppercase font-black"
              />
              <input
                type="text" placeholder="POSTAL CODE" value={postalCode} onChange={e => setPostalCode(e.target.value)}
                className="w-full h-14 px-6 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold bg-gallery-soft/30 text-xs tracking-widest uppercase font-black"
              />
              <input
                type="text" placeholder="COUNTRY" value={country} onChange={e => setCountry(e.target.value)}
                className="w-full h-14 px-6 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold bg-gallery-soft/30 text-xs tracking-widest uppercase font-black"
              />
              <input
                type="text" placeholder="CONTACT PHONE" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full h-14 px-6 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold bg-gallery-soft/30 text-xs tracking-widest uppercase font-black"
              />
            </div>
          </div>

          <div className="bg-gallery-surface border border-gallery-border p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-extralight text-gallery-text mb-6 border-b border-gallery-border pb-4 uppercase tracking-widest">Mark Location</h2>
            <div className="border border-gallery-border shadow-inner">
              <MapPicker onLocationSelect={(loc) => setLocation(loc)} />
            </div>
          </div>

          <div className="bg-gallery-surface border border-gallery-border p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-extralight text-gallery-text mb-6 border-b border-gallery-border pb-4 uppercase tracking-widest">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-center justify-between p-6 border cursor-pointer transition-all ${paymentMethod === "Card" ? "border-gallery-gold bg-gallery-soft" : "border-gallery-border bg-white"}`}>
                <div className="flex items-center gap-4">
                  <input
                    type="radio" value="Card" checked={paymentMethod === "Card"} onChange={e => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-gallery-gold"
                    disabled={clientSecret !== ""}
                  />
                  <span className="text-xs uppercase tracking-widest font-black">Pay Online</span>
                </div>
                <span className="text-[9px] uppercase tracking-tighter opacity-40">Card</span>
              </label>
              <label className={`flex items-center justify-between p-6 border cursor-pointer transition-all ${paymentMethod === "COD" ? "border-gallery-gold bg-gallery-soft" : "border-gallery-border bg-white"}`}>
                <div className="flex items-center gap-4">
                  <input
                    type="radio" value="COD" checked={paymentMethod === "COD"} onChange={e => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 accent-gallery-gold"
                    disabled={clientSecret !== ""}
                  />
                  <span className="text-xs uppercase tracking-widest font-black">Cash on Delivery</span>
                </div>
                <span className="text-[9px] uppercase tracking-tighter opacity-40">Cash</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Col - Summary & Payment */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gallery-surface border border-gallery-border p-8 shadow-2xl sticky top-24">
            <h2 className="text-xl sm:text-2xl font-extralight text-gallery-text mb-8 border-b border-gallery-border pb-4 uppercase tracking-widest">Summary</h2>

            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.product._id} className="flex justify-between items-start gap-4 text-xs">
                  <span className="text-gallery-muted tracking-wide flex-1 uppercase font-bold">{item.quantity} x {item.product.title}</span>
                  <span className="text-gallery-text font-black tracking-tighter">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gallery-border pt-6 mb-8">
              <div className="flex gap-2 mb-6 h-12">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-4 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold text-[10px] tracking-widest bg-gallery-soft/20 uppercase font-black"
                  disabled={appliedCoupon || clientSecret !== ""}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponInput || appliedCoupon || isApplyingCoupon || clientSecret !== ""}
                  className="px-6 bg-gallery-gold text-white text-[10px] tracking-[0.2em] uppercase font-black hover:bg-gallery-primary transition-all active:scale-95 disabled:opacity-50"
                >
                  {isApplyingCoupon ? "..." : (appliedCoupon ? "OK" : "Apply")}
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs tracking-widest uppercase text-gallery-muted font-bold">
                  <span>Subtotal</span>
                  <span className="text-gallery-text font-black">${getTotal().toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-xs tracking-widest uppercase text-emerald-600 font-black">
                    <span>Benefit ({appliedCoupon.code})</span>
                    <span>-${getDiscountAmount().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs tracking-widest uppercase text-gallery-muted font-bold">
                  <span>Shipping</span>
                  <span className="text-gallery-text font-black">Free</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gallery-border pt-6 mb-10">
              <div className="flex justify-between items-end">
                <span className="text-xs uppercase tracking-[0.4em] text-gallery-muted mb-1 font-black">Total Amount</span>
                <span className="text-3xl font-black text-gallery-accent tracking-tighter leading-none">${getFinalTotal().toFixed(2)}</span>
              </div>
            </div>

            {!clientSecret ? (
              <button
                onClick={placeOrder}
                disabled={isSubmitting}
                className="w-full h-16 bg-gallery-primary text-white text-[10px] tracking-[0.5em] uppercase font-black hover:bg-gallery-gold transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Place Order"}
              </button>
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm clientSecret={clientSecret} onSuccess={handleSuccess} />
              </Elements>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
