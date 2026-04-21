import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Product } from '../types';
import { db } from '../services/mockDb';
import { supabase } from '../services/supabaseClient';

export const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  const navigate = useNavigate();

  const loadProducts = () => {
    db.getProducts().then(data => {
      setProducts(data);
      setFiltered(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadProducts();

    // Subscribe to product changes (e.g. stock updates from other users)
    const channel = supabase.channel('shop-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
         loadProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let result = [...products];

    // Search
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    // Category
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    // Sort
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    setFiltered(result);
  }, [search, category, sort, products]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-theme-black py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-black text-5xl mb-8 text-center md:text-left text-white italic">SHOP <span className="text-theme-accent">ALL</span></h1>

        {/* Toolbar */}
        <div className="bg-theme-dark/80 backdrop-blur-md border border-gray-800 rounded-2xl p-4 shadow-3d mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <input 
              type="text" 
              placeholder="Search superheroes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-theme-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-theme-accent focus:ring-1 focus:ring-theme-accent focus:outline-none transition font-medium shadow-inner-3d"
            />
            <Search className="absolute left-3 top-3.5 text-gray-500" size={20} />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-theme-black border border-gray-700 rounded-xl px-4 py-3 shadow-inner-3d">
              <Filter size={18} className="text-theme-accent" />
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c} className="bg-theme-black">{c}</option>)}
              </select>
            </div>

            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-theme-black border border-gray-700 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-theme-accent cursor-pointer shadow-inner-3d"
            >
              <option value="newest" className="bg-theme-black">Newest</option>
              <option value="price-asc" className="bg-theme-black">Price: Low to High</option>
              <option value="price-desc" className="bg-theme-black">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 font-bold text-2xl text-gray-500 animate-pulse">Loading Mock Data...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-bold text-gray-400">No heroes found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="group">
                <div className="bg-theme-dark rounded-2xl overflow-hidden shadow-3d hover:shadow-3d-hover hover:-translate-y-2 transition-all duration-300 border border-gray-800 h-full flex flex-col relative">
                  
                  <div className="relative pt-[100%] overflow-hidden bg-gradient-to-b from-gray-800 to-black p-4">
                     <img 
                       src={product.image} 
                       alt={product.name} 
                       className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-110 transition duration-700 mix-blend-overlay opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal" 
                     />
                     <img 
                       src={product.image} 
                       alt={product.name} 
                       className="absolute top-[10%] left-[10%] w-[80%] h-[80%] object-contain drop-shadow-2xl group-hover:scale-105 transition duration-500" 
                     />
                     {product.stock === 0 && (
                       <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                         <span className="text-white font-black text-2xl tracking-widest border-2 border-white px-4 py-1">SOLD OUT</span>
                       </div>
                     )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow relative overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-theme-accent/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 z-10">{product.category}</p>
                    <h3 className="font-bold text-lg leading-tight mb-2 text-white group-hover:text-theme-accent transition z-10">{product.name}</h3>
                    <div className="mt-auto flex items-center justify-between z-10">
                      <span className="font-display font-bold text-xl text-white">৳{product.price}</span>
                      <span className="text-xs font-bold bg-theme-black border border-gray-700 text-white px-3 py-1.5 rounded-lg group-hover:bg-theme-accent group-hover:border-theme-accent transition">VIEW</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};