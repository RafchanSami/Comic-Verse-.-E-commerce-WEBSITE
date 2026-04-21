import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { supabase } from '../services/supabaseClient';
import { Order, OrderStatus } from '../types';
import { Search, Package, CheckCircle, Truck, Clock, AlertTriangle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Subscribe to changes if an order is currently being tracked
  useEffect(() => {
    if (!order) return;

    const channel = supabase.channel(`tracking-${order.id}`)
      .on(
        'postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${order.id}` },
        (payload) => {
           // When the order updates, re-fetch it (or use payload.new but DB mapping is safer)
           console.log("Order status updated!", payload);
           db.getOrder(order.id).then(updatedOrder => {
              if (updatedOrder) setOrder(updatedOrder);
           });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order?.id]); // Re-run subscription when order ID changes

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const foundOrder = await db.getOrder(orderId.trim());
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('Order not found. Please check your Order ID.');
      }
    } catch (err) {
      setError('An error occurred while tracking.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 1;
      case OrderStatus.CONFIRMED: return 2;
      case OrderStatus.SHIPPED: return 3;
      case OrderStatus.DELIVERED: return 4;
      case OrderStatus.CANCELLED: return 0;
      default: return 1;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 0;

  return (
    <div className="min-h-screen bg-theme-black py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-black text-4xl text-center text-white italic mb-2">TRACK YOUR <span className="text-theme-accent">ORDER</span></h1>
        <p className="text-gray-400 text-center mb-12">Enter your Order ID to see the current status of your gear.</p>

        <div className="bg-theme-dark/50 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-3d mb-8">
          <form onSubmit={handleTrack} className="flex gap-4">
            <div className="relative flex-grow">
               <input 
                 type="text" 
                 placeholder="Enter Order ID (e.g. ORD-123456)" 
                 value={orderId}
                 onChange={(e) => setOrderId(e.target.value)}
                 className="w-full bg-theme-black border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-theme-accent focus:outline-none shadow-inner-3d font-mono"
               />
               <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-theme-accent text-white px-8 rounded-xl font-bold shadow-neon hover:bg-theme-accent-hover transition"
            >
              {loading ? 'TRACKING...' : 'TRACK'}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl flex items-center gap-3">
              <AlertTriangle size={20} />
              <span className="font-bold">{error}</span>
            </div>
          )}
        </div>

        {order && (
          <div className="bg-theme-dark/50 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-3d animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-800 pb-6 gap-4">
                <div>
                   <h2 className="text-2xl font-bold text-white mb-1">Order #{order.id}</h2>
                   <p className="text-gray-400 text-sm">Placed on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <Link 
                  to={`/invoice/${order.id}`}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold transition border border-gray-700"
                >
                  <FileText size={18} /> View Money Receipt
                </Link>
             </div>

             {order.status === OrderStatus.CANCELLED ? (
                <div className="bg-red-500/10 text-red-500 p-6 rounded-xl text-center font-bold text-xl border border-red-500/30">
                   This order has been cancelled.
                </div>
             ) : (
                <div className="relative">
                   {/* Progress Bar Background */}
                   <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 z-0 hidden md:block"></div>
                   
                   <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                      {[
                        { step: 1, label: 'Order Placed', icon: Clock },
                        { step: 2, label: 'Confirmed', icon: CheckCircle },
                        { step: 3, label: 'Shipped', icon: Truck },
                        { step: 4, label: 'Delivered', icon: Package },
                      ].map((s, idx) => {
                        const isCompleted = currentStep >= s.step;
                        const isCurrent = currentStep === s.step;
                        return (
                          <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-2">
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCompleted ? 'bg-theme-accent border-theme-accent text-white shadow-neon' : 'bg-theme-black border-gray-700 text-gray-600'}`}>
                                <s.icon size={20} />
                             </div>
                             <div className="md:text-center">
                                <p className={`font-bold ${isCompleted ? 'text-white' : 'text-gray-600'}`}>{s.label}</p>
                                {isCurrent && <p className="text-xs text-theme-accent font-bold animate-pulse">In Progress</p>}
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
             )}

             <div className="mt-12 bg-theme-black/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                       <span className="text-gray-300">{item.quantity}x {item.name}</span>
                       <span className="text-white font-bold">৳{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-700 pt-4 flex justify-between font-bold text-white text-lg">
                     <span>Total Paid</span>
                     <span className="text-theme-accent">৳{order.totalAmount}</span>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};