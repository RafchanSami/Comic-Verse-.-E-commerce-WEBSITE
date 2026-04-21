import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/mockDb';
import { supabase } from '../services/supabaseClient';
import { Order, Product, User, UserRole, PromoCode, Notice, Category } from '../types';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Tag, Megaphone, List, Settings, Loader } from 'lucide-react';
import { AdminStats } from '../components/admin/AdminStats';
import { AdminProducts } from '../components/admin/AdminProducts';
import { AdminOrders } from '../components/admin/AdminOrders';
import { AdminUsers } from '../components/admin/AdminUsers';
import { AdminPromos } from '../components/admin/AdminPromos';
import { AdminNotices } from '../components/admin/AdminNotices';
import { AdminCategories } from '../components/admin/AdminCategories';
import { AdminSettings } from '../components/admin/AdminSettings';

type Tab = 'dashboard' | 'products' | 'categories' | 'orders' | 'users' | 'promos' | 'notices' | 'settings';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we are sure there is no user (isLoading is false and user is null)
    if (!isLoading && (!user || user.role !== UserRole.ADMIN)) {
      navigate('/');
      return;
    }

    if (user && user.role === UserRole.ADMIN) {
        fetchData();

        // --------------------------------------------------------
        // Realtime Subscription Logic
        // --------------------------------------------------------
        const channel = supabase.channel('admin-dashboard')
          .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
             // We refresh specific data based on the table that changed
             const table = payload.table;
             
             switch (table) {
                case 'orders':
                   db.getOrders().then(setOrders);
                   break;
                case 'products':
                   db.getProducts().then(setProducts);
                   break;
                case 'profiles':
                   db.getUsers().then(setUsers);
                   break;
                case 'promos':
                   db.getPromos().then(setPromos);
                   break;
                case 'notices':
                   db.getNotices().then(setNotices);
                   break;
                case 'categories':
                   db.getCategories().then(setCategories);
                   break;
                default:
                   break;
             }
          })
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
    }
  }, [user, navigate, isLoading]);

  const fetchData = async () => {
    try {
        const [ordersData, productsData, categoriesData, usersData, promosData, noticesData] = await Promise.all([
        db.getOrders(),
        db.getProducts(),
        db.getCategories(),
        db.getUsers(),
        db.getPromos(),
        db.getNotices()
        ]);
        setOrders(ordersData);
        setProducts(productsData);
        setCategories(categoriesData);
        setUsers(usersData);
        setPromos(promosData);
        setNotices(noticesData);
    } catch (e) {
        console.error("Failed to fetch admin data", e);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Inventory', icon: Package },
    { id: 'categories', label: 'Categories', icon: List },
    { id: 'users', label: 'Customers', icon: Users },
    { id: 'promos', label: 'Discounts', icon: Tag },
    { id: 'notices', label: 'Notices', icon: Megaphone },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (isLoading && !user) {
      return (
          <div className="min-h-screen bg-theme-black flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                  <Loader className="animate-spin text-theme-accent" size={48} />
                  <p className="text-gray-400 font-bold">Verifying Admin Access...</p>
              </div>
          </div>
      );
  }

  if (!user || user.role !== UserRole.ADMIN) return null;

  return (
    <div className="min-h-screen bg-theme-black flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-theme-dark border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="font-display font-black text-2xl text-white italic">COMIC <span className="text-theme-accent">ADMIN</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-bold ${
                  activeTab === item.id 
                    ? 'bg-theme-accent text-white shadow-neon' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
           <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-theme-accent to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                 AD
              </div>
              <div className="text-sm">
                 <p className="font-bold text-white">{user.name}</p>
                 <p className="text-xs text-gray-500">Administrator</p>
              </div>
           </div>
           <button 
             onClick={() => { logout(); navigate('/'); }}
             className="w-full flex items-center space-x-3 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition font-bold text-sm"
           >
             <LogOut size={18} />
             <span>Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <header className="mb-8">
           <h2 className="font-display font-black text-6xl text-white capitalize drop-shadow-lg">{activeTab} Overview</h2>
           <p className="text-gray-500 text-lg mt-2">Manage your {activeTab} efficiently.</p>
        </header>

        {activeTab === 'dashboard' && (
          <>
            <AdminStats orders={orders} products={products} users={users} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-theme-dark/50 rounded-2xl p-6 border border-gray-800">
                 <h3 className="font-bold text-white mb-4">Recent Orders</h3>
                 <AdminOrders orders={orders.slice(0, 5)} onUpdate={fetchData} />
              </div>
              <div className="bg-theme-dark/50 rounded-2xl p-6 border border-gray-800">
                 <h3 className="font-bold text-white mb-4">New Customers</h3>
                 <AdminUsers users={users.slice(0, 5)} onUpdate={fetchData} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <AdminProducts products={products} onUpdate={fetchData} />
        )}

        {activeTab === 'categories' && (
          <AdminCategories categories={categories} onUpdate={fetchData} />
        )}

        {activeTab === 'orders' && (
          <AdminOrders orders={orders} onUpdate={fetchData} />
        )}

        {activeTab === 'users' && (
          <AdminUsers users={users} onUpdate={fetchData} />
        )}
        
        {activeTab === 'promos' && (
          <AdminPromos promos={promos} onUpdate={fetchData} />
        )}

        {activeTab === 'notices' && (
          <AdminNotices notices={notices} onUpdate={fetchData} />
        )}

        {activeTab === 'settings' && (
          <AdminSettings />
        )}
      </main>
    </div>
  );
};