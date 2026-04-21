import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Tag, X, Truck } from 'lucide-react';
import { useCart, SHIPPING_RATES } from '../context/CartContext';

export const Cart = () => {
  const { items, removeFromCart, updateQuantity, subtotal, discount, total, clearCart, applyPromo, removePromo, appliedPromo, shippingCost, setShipping } = useCart();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    const success = await applyPromo(promoInput.toUpperCase());
    if (success) {
      setPromoMessage({ text: 'Promo code applied!', type: 'success' });
      setPromoInput('');
    } else {
      setPromoMessage({ text: 'Invalid or expired code.', type: 'error' });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-theme-black flex flex-col items-center justify-center p-4">
        <h2 className="font-display font-bold text-4xl mb-4 text-gray-600">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't picked your gear yet.</p>
        <Link to="/shop" className="px-8 py-3 bg-theme-accent text-white rounded-xl font-bold shadow-neon hover:bg-theme-accent-hover transition transform hover:-translate-y-1">
          GO TO SHOP
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-black text-5xl mb-8 text-white italic">YOUR <span className="text-theme-accent">STASH</span></h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-theme-dark/50 backdrop-blur-md rounded-2xl border border-gray-800 shadow-3d overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-800 bg-black/20 font-bold text-sm uppercase text-gray-400">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              <div className="divide-y divide-gray-800">
                {items.map(item => (
                  <div key={item.id} className="p-4 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 w-full flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-lg p-1 border border-gray-700">
                         <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 text-xs font-bold flex items-center mt-2 hover:text-red-400 transition"
                        >
                          <Trash2 size={12} className="mr-1" /> REMOVE
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-2 font-bold text-gray-300 sm:text-center">
                      <span className="sm:hidden mr-2 text-gray-500">Price:</span>
                      ৳{item.price}
                    </div>
                    
                    <div className="col-span-2 flex justify-center">
                       <div className="flex items-center bg-theme-black rounded-lg border border-gray-700 shadow-inner-3d">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-800 rounded-l-lg text-white"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 font-bold text-sm text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-800 rounded-r-lg text-white"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-2 font-display font-bold text-xl sm:text-right text-theme-accent">
                       ৳{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button onClick={clearCart} className="text-red-500 font-bold hover:text-red-400 text-sm">Clear Cart</button>
              <Link to="/shop" className="font-bold text-gray-400 hover:text-white border-b border-gray-700 pb-0.5">Continue Shopping</Link>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-1/3">
            <div className="bg-theme-dark/50 backdrop-blur-md rounded-2xl border border-gray-800 p-8 shadow-3d sticky top-24">
              <h2 className="font-display font-bold text-2xl mb-6 border-b border-gray-800 pb-4 text-white">ORDER SUMMARY</h2>
              
              <div className="space-y-4 mb-6 text-gray-300">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>
                
                {/* Shipping Selector */}
                <div className="space-y-2">
                  <div className="flex justify-between font-medium">
                    <span className="flex items-center gap-2"><Truck size={16}/> Delivery</span>
                    <span>৳{shippingCost}</span>
                  </div>
                  <select 
                    value={shippingCost}
                    onChange={(e) => setShipping(Number(e.target.value))}
                    className="w-full bg-theme-black border border-gray-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-theme-accent"
                  >
                    {SHIPPING_RATES.map(rate => (
                      <option key={rate.id} value={rate.price}>
                        {rate.label} - ৳{rate.price}
                      </option>
                    ))}
                  </select>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between font-medium text-theme-accent">
                    <span>Discount</span>
                    <span>- ৳{discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl pt-4 border-t border-gray-800 text-white">
                  <span>Total</span>
                  <span className="text-theme-accent">৳{total + shippingCost}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Promo Code</label>
                {appliedPromo ? (
                   <div className="flex justify-between items-center bg-green-500/10 border border-green-500/30 p-3 rounded-xl">
                      <span className="text-green-500 font-bold flex items-center gap-2"><Tag size={16}/> {appliedPromo.code}</span>
                      <button onClick={removePromo} className="text-gray-400 hover:text-white"><X size={16}/></button>
                   </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value); setPromoMessage(null); }}
                      placeholder="Enter code"
                      className="flex-1 bg-theme-black border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-theme-accent text-sm shadow-inner-3d"
                    />
                    <button 
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-theme-gray border border-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-sm transition"
                    >
                      APPLY
                    </button>
                  </div>
                )}
                {promoMessage && (
                  <p className={`text-xs mt-2 font-bold ${promoMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-theme-accent text-white py-4 rounded-xl font-bold shadow-neon hover:bg-theme-accent-hover hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all flex justify-between items-center px-6 transform hover:-translate-y-1"
              >
                PROCEED TO CHECKOUT
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};