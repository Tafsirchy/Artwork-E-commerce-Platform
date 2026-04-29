"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import MapPicker from "@/components/map/MapPicker";
import api from "@/lib/api";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Make sure to set NEXT_PUBLIC_STRIPE_PUBLIC_KEY in .env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "pk_test_dummy");

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
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
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
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060 });
  const [paymentMethod, setPaymentMethod] = useState("Card");
  
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    }
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [user, items, router]);

  const placeOrder = async () => {
    if (!address || !city || !postalCode || !country) {
      toast.error("Please fill in all address fields");
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
        shippingAddress: { address, city, postalCode, country, location },
        paymentMethod,
        itemsPrice: getTotal(),
        shippingPrice: 0, // Free shipping
        totalPrice: getTotal(),
      };

      const { data } = await api.post("/orders", orderData);
      setOrderId(data.order._id);
      
      if (paymentMethod === "Card") {
        setClientSecret(data.clientSecret);
      } else {
        // COD
        handleSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error placing order");
      setIsSubmitting(false);
    }
  };

  const handleSuccess = () => {
    clearCart();
    toast.success("Order placed successfully!", { style: { backgroundColor: "#4CAF50", color: "#fff" }});
    router.push("/products"); // Redirect to shop or orders list
  };

  if (items.length === 0 || !user) return null;

  return (
    <div className="min-h-screen bg-gallery-bg py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left Col - Details */}
        <div className="w-full lg:w-2/3 space-y-8">
          
          <div className="bg-gallery-surface border border-gallery-border p-6 md:p-8">
            <h2 className="text-2xl font-light text-gallery-text mb-6 border-b border-gallery-border pb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)}
                className="col-span-1 md:col-span-2 w-full px-4 py-3 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold"
              />
              <input 
                type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)}
                className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold"
              />
              <input 
                type="text" placeholder="Postal Code" value={postalCode} onChange={e => setPostalCode(e.target.value)}
                className="w-full px-4 py-3 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold"
              />
              <input 
                type="text" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)}
                className="col-span-1 md:col-span-2 w-full px-4 py-3 border border-gallery-border focus:outline-none focus:ring-1 focus:ring-gallery-gold"
              />
            </div>
          </div>

          <div className="bg-gallery-surface border border-gallery-border p-6 md:p-8">
            <h2 className="text-2xl font-light text-gallery-text mb-6 border-b border-gallery-border pb-4">Pin Location</h2>
            <MapPicker onLocationSelect={(loc) => setLocation(loc)} />
          </div>

          <div className="bg-gallery-surface border border-gallery-border p-6 md:p-8">
            <h2 className="text-2xl font-light text-gallery-text mb-6 border-b border-gallery-border pb-4">Payment Method</h2>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" value="Card" checked={paymentMethod === "Card"} onChange={e => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-gallery-primary"
                  disabled={clientSecret !== ""}
                />
                <span className="text-gallery-text">Credit/Debit Card</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" value="COD" checked={paymentMethod === "COD"} onChange={e => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-gallery-primary"
                  disabled={clientSecret !== ""}
                />
                <span className="text-gallery-text">Cash on Delivery</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Col - Summary & Payment */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gallery-surface border border-gallery-border p-6 sticky top-24">
            <h2 className="text-2xl font-light text-gallery-text mb-6 border-b border-gallery-border pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
              {items.map(item => (
                <div key={item.product._id} className="flex justify-between text-sm">
                  <span className="text-gallery-muted truncate pr-4">{item.quantity} x {item.product.title}</span>
                  <span className="text-gallery-text font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gallery-border pt-4 mb-8">
              <div className="flex justify-between text-xl text-gallery-text font-bold">
                <span>Total</span>
                <span className="text-gallery-accent">${getTotal().toFixed(2)}</span>
              </div>
            </div>
            
            {!clientSecret ? (
              <button 
                onClick={placeOrder}
                disabled={isSubmitting}
                className="w-full py-4 bg-gallery-primary text-white text-lg rounded hover:bg-black transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
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
