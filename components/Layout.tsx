import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, Package, Megaphone, Phone, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { UserRole, Notice } from '../types';
import { db } from '../services/mockDb';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    db.getActiveNotices().then(setNotices);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Notice Banner */}
      {notices.length > 0 && (
        <div className="bg-theme-accent text-white text-xs md:text-sm py-2 overflow-hidden relative z-50 shadow-neon">
          <div className="animate-marquee whitespace-nowrap flex items-center justify-center gap-8">
            {notices.map(notice => (
              <span key={notice.id} className="flex items-center gap-2 font-bold mx-4">
                <Megaphone size={14} /> {notice.message}
              </span>
            ))}
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-40 bg-theme-black/90 backdrop-blur-lg border-b border-gray-800 shadow-3d">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center group">
                <img 
                  src="data:image/jpeg;base64,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" 
                  alt="Comic Verse" 
                  className="h-12 md:h-16 object-contain transition-transform transform group-hover:scale-105 duration-300" 
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link to="/" className="text-gray-300 font-bold hover:text-white hover:shadow-neon transition duration-300">HOME</Link>
              <Link to="/about" className="text-gray-300 font-bold hover:text-white hover:shadow-neon transition duration-300">ABOUT</Link>
              <Link to="/shop" className="text-gray-300 font-bold hover:text-white hover:shadow-neon transition duration-300">SHOP</Link>
              <Link to="/track-order" className="text-gray-300 font-bold hover:text-white hover:shadow-neon transition duration-300">TRACK</Link>
              
              {isAuthenticated && user?.role === UserRole.ADMIN && (
                 <Link to="/admin" className="text-theme-accent font-bold hover:text-white transition flex items-center gap-1">
                   <Package size={18} /> ADMIN
                 </Link>
              )}

              <div className="flex items-center space-x-4">
                <Link to="/cart" className="relative group">
                  <div className="p-2 rounded-lg bg-gradient-card shadow-3d group-hover:shadow-neon text-gray-300 group-hover:text-white transition border border-gray-700">
                    <ShoppingCart size={20} />
                  </div>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-theme-accent text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <Link to="/dashboard" className="hidden md:flex items-center gap-2 font-bold text-sm text-gray-400 hover:text-theme-accent transition mr-2">
                       Hi, {user?.name.split(' ')[0]}
                    </Link>
                    
                    <Link 
                      to="/dashboard"
                      className="p-2 rounded-lg bg-gradient-card shadow-3d text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 transition"
                      title="My Dashboard"
                    >
                      <User size={20} />
                    </Link>

                    <button 
                      onClick={handleLogout}
                      className="p-2 rounded-lg bg-gradient-card shadow-3d text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 transition"
                      title="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="px-6 py-2 rounded-lg bg-theme-accent text-white font-bold shadow-neon hover:bg-theme-accent-hover transition transform hover:-translate-y-0.5">
                    LOGIN
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-300 hover:bg-gray-800 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-theme-dark border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-300 hover:bg-gray-800 hover:text-white">HOME</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-300 hover:bg-gray-800 hover:text-white">ABOUT US</Link>
              <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-300 hover:bg-gray-800 hover:text-white">SHOP</Link>
              <Link to="/track-order" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-300 hover:bg-gray-800 hover:text-white">TRACK ORDER</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-300 hover:bg-gray-800 hover:text-white">CONNECT US</Link>
              <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-300 hover:bg-gray-800 hover:text-white">CART ({itemCount})</Link>
              {isAuthenticated && user?.role === UserRole.ADMIN && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-theme-accent hover:bg-gray-800">ADMIN PANEL</Link>
              )}
              {isAuthenticated ? (
                 <>
                   <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-300 hover:bg-gray-800 hover:text-white">MY DASHBOARD</Link>
                   <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-base font-bold text-gray-300 hover:bg-gray-800 hover:text-white">LOGOUT</button>
                 </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-gray-300 hover:bg-gray-800 hover:text-white">LOGIN / SIGNUP</Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export const Footer = () => (
  <footer className="bg-theme-black text-white py-12 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
      <div className="flex flex-col items-center md:items-start">
        <img 
            src="https://imgur.com/ae75df3b-8887-4bd7-8f76-bd1e3cbb3a83" 
            alt="Comic Verse" 
            className="h-16 mb-4 object-contain" 
        />
        <p className="text-gray-500 max-w-xs mx-auto md:mx-0">
          Unleash your inner hero with footwear designed for speed, power, and style.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-4 text-gray-200">Quick Links</h4>
        <ul className="space-y-2 text-gray-500">
          <li><Link to="/shop" className="hover:text-theme-accent transition">New Arrivals</Link></li>
          <li><Link to="/about" className="hover:text-theme-accent transition">Our Story</Link></li>
          <li><Link to="/track-order" className="hover:text-theme-accent transition">Track Order</Link></li>
          <li><Link to="/contact" className="hover:text-theme-accent transition">Contact Us</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-4 text-gray-200">Customer Care</h4>
        <p className="text-gray-500">support@comicverse.com</p>
        <p className="text-gray-500">+880 1XXX-XXXXXX</p>
        <div className="mt-4 flex justify-center md:justify-start gap-4">
          <div className="w-8 h-8 bg-theme-accent rounded-full shadow-neon"></div>
          <div className="w-8 h-8 bg-purple-600 rounded-full shadow-lg"></div>
          <div className="w-8 h-8 bg-gray-600 rounded-full shadow-lg"></div>
        </div>
      </div>
    </div>
    <div className="mt-8 text-center text-gray-700 text-sm">
      © {new Date().getFullYear()} Comic Verse. All rights reserved.
    </div>
  </footer>
);

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-theme-black text-gray-200">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};