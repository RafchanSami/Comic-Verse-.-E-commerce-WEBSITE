import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/mockDb';
import { Order, OrderStatus } from '../types';
import { Package, Clock, CheckCircle, Truck, XCircle, FileText, User as UserIcon } from 'lucide-react';

export const UserDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      db.getOrders(user.id).then(data => {
        setOrders(data);
        setLoading(false);
      });
    }
  }, [user, isAuthenticated, navigate]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case OrderStatus.CONFIRMED: return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case OrderStatus.SHIPPED: return 'text-purple-500 bg-purple-500/10 border-purple-500/30';
      case OrderStatus.DELIVERED: return 'text-green-500 bg-green-500/10 border-green-500/30';
      case OrderStatus.CANCELLED: return 'text-red-500 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return <Clock size={16} />;
      case OrderStatus.CONFIRMED: return <CheckCircle size={16} />;
      case OrderStatus.SHIPPED: return <Truck size={16} />;
      case OrderStatus.DELIVERED: return <Package size={16} />;
      case OrderStatus.CANCELLED: return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-theme-black flex items-center justify-center">
      <div className="text-white font-bold text-xl animate-pulse">Loading Dashboard...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-theme-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-800 pb-8">
          <div>
             <h1 className="font-display font-black text-4xl text-white italic mb-2">MY <span className="text-theme-accent">DASHBOARD</span></h1>
             <p className="text-gray-400">Welcome back, {user?.name}. Here is your mission history.</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
             <button onClick={() => { logout(); navigate('/'); }} className="px-6 py-2 border border-gray-700 hover:border-red-500 text-gray-300 hover:text-red-500 rounded-lg font-bold transition">
               Logout
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar Info */}
           <div className="lg:col-span-1">
              <div className="bg-theme-dark/50 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-3d">
                 <div className="w-20 h-20 bg-theme-accent/10 rounded-full flex items-center justify-center text-theme-accent mb-4 mx-auto">
                    <UserIcon size={40} />
                 </div>
                 <h2 className="text-xl font-bold text-white text-center mb-1">{user?.name}</h2>
                 <p className="text-sm text-gray-500 text-center mb-6">{user?.email}</p>
                 <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-400 border-b border-gray-800 pb-2">
                       <span>Member Since</span>
                       <span className="text-white font-bold">2024</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 border-b border-gray-800 pb-2">
                       <span>Total Orders</span>
                       <span className="text-white font-bold">{orders.length}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Orders List */}
           <div className="lg:col-span-3">
              <h2 className="font-bold text-2xl text-white mb-6 flex items-center gap-2">
                 <Package className="text-theme-accent" /> Order History
              </h2>
              
              {orders.length === 0 ? (
                 <div className="bg-theme-dark/50 p-12 rounded-2xl border border-gray-800 text-center">
                    <Package size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Orders Yet</h3>
                    <p className="text-gray-400 mb-6">You haven't purchased any gear yet.</p>
                    <Link to="/shop" className="inline-block px-8 py-3 bg-theme-accent text-white rounded-xl font-bold hover:bg-theme-accent-hover transition">
                       Start Shopping
                    </Link>
                 </div>
              ) : (
                 <div className="space-y-4">
                    {orders.map(order => (
                       <div key={order.id} className="bg-theme-dark/50 backdrop-blur-md p-6 rounded-2xl border border-gray-800 hover:border-theme-accent/50 transition duration-300 group">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                             <div>
                                <div className="flex items-center gap-3 mb-1">
                                   <span className="text-lg font-bold text-white">#{order.id}</span>
                                   <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                      {getStatusIcon(order.status)} {order.status}
                                   </span>
                                </div>
                                <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()} • {order.items.length} Items</p>
                             </div>
                             <div className="flex items-center gap-4">
                                <span className="font-display font-bold text-xl text-white">৳{order.totalAmount}</span>
                                <Link to={`/invoice/${order.id}`} className="p-2 bg-gray-800 hover:bg-theme-accent text-gray-400 hover:text-white rounded-lg transition" title="View Invoice">
                                   <FileText size={20} />
                                </Link>
                             </div>
                          </div>
                          
                          <div className="bg-black/20 rounded-xl p-4 flex gap-4 overflow-x-auto">
                             {order.items.map((item, i) => (
                                <div key={i} className="flex-shrink-0 flex items-center gap-3 min-w-[200px]">
                                   <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden">
                                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold text-white truncate max-w-[120px]">{item.name}</p>
                                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};