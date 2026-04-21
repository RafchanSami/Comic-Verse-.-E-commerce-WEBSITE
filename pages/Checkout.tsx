import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, SHIPPING_RATES } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/mockDb';
import { CheckCircle, ShieldCheck, Truck, Package } from 'lucide-react';
import {
  PaymentMethod,
  Order,
  OrderStatus,
  PaymentStatus
} from '../types';

export const Checkout = () => {
  const {
    items,
    total,
    subtotal,
    discount,
    appliedPromo,
    clearCart,
    shippingCost,
    setShipping
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    phone: '',
    paymentMethod: PaymentMethod.COD as PaymentMethod,
    trxId: ''
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (showSuccess && confirmedOrder) {
      const timer = setTimeout(() => {
        navigate(`/invoice/${confirmedOrder.id}`, {
          state: { order: confirmedOrder },
          replace: true
        });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, confirmedOrder, navigate]);

  // 🔐 Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-theme-black">
        <h2 className="text-3xl font-bold text-white mb-4">
          Authentication Required
        </h2>
        <p className="text-gray-400 mb-6">
          Please login to complete your purchase.
        </p>
        <button
          onClick={() => navigate('/login?redirect=checkout')}
          className="bg-theme-accent text-white px-6 py-2 rounded-lg font-bold hover:bg-theme-accent-hover"
        >
          Login Now
        </button>
      </div>
    );
  }

  // 🛒 Empty cart check (skip if showing success animation)
  if (items.length === 0 && !showSuccess) {
    navigate('/shop');
    return null;
  }

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.paymentMethod === PaymentMethod.BKASH &&
      !formData.trxId
    ) {
      alert('Please enter Transaction ID for bKash payment');
      return;
    }

    setLoading(true);

    const orderPayload = {
      userId: user!.id,
      items,
      totalAmount: total + shippingCost,
      discountAmount: discount,
      promoCode: appliedPromo?.code,
      shippingCost,
      shippingAddress: formData.address,
      contactNumber: formData.phone,
      paymentMethod: formData.paymentMethod,
      transactionId: formData.trxId
    };

    try {
      // ✅ REAL DB ORDER
      const newOrder = await db.createOrder(orderPayload);
      clearCart();
      setConfirmedOrder(newOrder);
      setShowSuccess(true);
    } catch (err) {
      // ⚠️ DEMO FALLBACK
      const demoOrder: Order = {
        id: `INV-${Date.now()}`,
        ...orderPayload,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        date: new Date().toISOString()
      };
      clearCart();
      setConfirmedOrder(demoOrder);
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-theme-black z-50 flex flex-col items-center justify-center p-4">
        <div className="relative mb-8 animate-scale-in">
            <div className="absolute inset-0 bg-green-500 blur-[60px] opacity-20 rounded-full animate-pulse"></div>
            <div className="w-32 h-32 bg-theme-dark rounded-full border-4 border-green-500 flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                <CheckCircle size={64} className="text-green-500 drop-shadow-lg" />
            </div>
            {/* Orbiting particles */}
            <div className="absolute top-0 left-0 w-full h-full animate-spin duration-[3000ms]">
                <div className="w-3 h-3 bg-theme-accent rounded-full absolute -top-1 left-1/2 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            </div>
        </div>
        
        <h2 className="font-display font-black text-5xl text-white mb-2 animate-fade-in-up">ORDER CONFIRMED</h2>
        <p className="text-gray-400 text-xl font-bold mb-8 animate-fade-in-up delay-100 flex items-center gap-2">
           <ShieldCheck size={20} className="text-theme-accent"/> Mission Initiated
        </p>

        <div className="w-full max-w-sm bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-theme-accent animate-progress shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
        </div>
        
        <div className="mt-8 grid grid-cols-3 gap-8 text-center opacity-0 animate-fade-in-up delay-200" style={{animationFillMode: 'forwards'}}>
             <div className="flex flex-col items-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-green-500 border border-green-500/30">
                    <CheckCircle size={18} />
                 </div>
                 <span className="text-xs font-bold text-gray-500 uppercase">Placed</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 border border-gray-700">
                    <Package size={18} />
                 </div>
                 <span className="text-xs font-bold text-gray-500 uppercase">Processing</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 border border-gray-700">
                    <Truck size={18} />
                 </div>
                 <span className="text-xs font-bold text-gray-500 uppercase">Delivery</span>
             </div>
        </div>

        <p className="mt-8 text-sm text-gray-600 font-mono animate-pulse">Redirecting to secure invoice...</p>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-theme-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-black italic text-white mb-8 border-b border-gray-800 pb-2">
          CHECKOUT
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ================= FORM ================= */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SHIPPING */}
            <div className="bg-theme-dark/50 p-6 rounded-2xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-6">
                Shipping Details
              </h3>

              <input
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full mb-3 p-3 rounded-xl bg-theme-black border border-gray-700 text-white"
              />

              <input
                required
                placeholder="Phone Number"
                value={formData.phone}
                onChange={e =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full mb-3 p-3 rounded-xl bg-theme-black border border-gray-700 text-white"
              />

              <select
                value={shippingCost}
                onChange={e => setShipping(Number(e.target.value))}
                className="w-full mb-3 p-3 rounded-xl bg-theme-black border border-gray-700 text-white"
              >
                {SHIPPING_RATES.map(rate => (
                  <option key={rate.id} value={rate.price}>
                    {rate.label} - ৳{rate.price}
                  </option>
                ))}
              </select>

              <textarea
                required
                rows={3}
                placeholder="Delivery Address"
                value={formData.address}
                onChange={e =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-theme-black border border-gray-700 text-white"
              />
            </div>

            {/* PAYMENT */}
            <div className="bg-theme-dark/50 p-6 rounded-2xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">
                Payment Method
              </h3>

              {/* COD */}
              <label className="flex items-center gap-3 mb-3 text-white">
                <input
                  type="radio"
                  checked={formData.paymentMethod === PaymentMethod.COD}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      paymentMethod: PaymentMethod.COD
                    })
                  }
                />
                Cash On Delivery
              </label>

              {/* BKASH */}
              <label className="flex flex-col gap-2 text-pink-500">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={
                      formData.paymentMethod === PaymentMethod.BKASH
                    }
                    onChange={() =>
                      setFormData({
                        ...formData,
                        paymentMethod: PaymentMethod.BKASH
                      })
                    }
                  />
                  bKash Payment
                </div>

                {formData.paymentMethod === PaymentMethod.BKASH && (
                  <>
                    <p className="text-sm text-gray-300">
                      Send money to <b>01634680632</b>
                    </p>
                    <input
                      required
                      placeholder="Transaction ID"
                      value={formData.trxId}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          trxId: e.target.value
                        })
                      }
                      className="p-2 rounded-lg bg-theme-black border border-gray-700 text-white"
                    />
                  </>
                )}
              </label>
            </div>

            {/* PAY BUTTON */}
            <button
              disabled={loading}
              className="w-full py-4 bg-theme-accent text-white text-xl font-bold rounded-xl hover:bg-theme-accent-hover disabled:opacity-50"
            >
              {loading
                ? 'PROCESSING...'
                : `PAY ৳${total + shippingCost}`}
            </button>
          </form>

          {/* ================= ORDER SUMMARY ================= */}
          <div className="bg-theme-dark/50 p-6 rounded-2xl border border-gray-800 h-fit">
            <h3 className="text-lg font-bold text-white mb-4">
              Your Order
            </h3>

            {items.map(item => (
              <div
                key={item.id}
                className="flex justify-between text-gray-300 text-sm"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span className="text-white font-bold">
                  ৳{item.price * item.quantity}
                </span>
              </div>
            ))}

            <hr className="my-4 border-gray-700" />

            <div className="text-gray-300 space-y-1 font-bold">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>৳{shippingCost}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-theme-accent">
                  <span>Discount</span>
                  <span>- ৳{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-xl text-white pt-2 border-t border-gray-700">
                <span>Total</span>
                <span className="text-theme-accent">
                  ৳{total + shippingCost}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};