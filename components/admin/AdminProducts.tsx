
import React, { useState, useEffect, useRef } from 'react';
import { Product, Category } from '../../types';
import { db } from '../../services/mockDb';
import { supabase } from '../../services/supabaseClient';
// Added CheckCircle to imports
import { Edit, Trash2, Plus, X, Image as ImageIcon, Upload, Layers, Type, Tag, DollarSign, Box, Loader, CheckCircle } from 'lucide-react';

interface Props {
  products: Product[];
  onUpdate: () => void;
}

export const AdminProducts = ({ products, onUpdate }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    description: '',
    image: '',
    sizes: [],
    featured: false
  });
  const [sizeInput, setSizeInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    db.getCategories().then(setCategories);
  }, [isModalOpen]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      heroStats: product.heroStats
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories.length > 0 ? categories[0].name : '',
      price: 0,
      stock: 0,
      description: '',
      image: '',
      sizes: [],
      featured: false,
      heroStats: {
        speed: 50,
        durability: 50,
        stealth: 50,
        comfort: 50
      }
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This cannot be undone.')) {
      setDeletingId(id);
      try {
          await db.deleteProduct(id);
          onUpdate();
      } catch (error: any) {
          console.error("Failed to delete:", error);
          alert(`Failed to delete product: ${error.message || 'Unknown error'}`);
      } finally {
          setDeletingId(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (editingProduct) {
          await db.updateProduct(editingProduct.id, formData);
        } else {
          await db.createProduct(formData as Omit<Product, 'id'>);
        }
        setIsModalOpen(false);
        onUpdate();
    } catch (error: any) {
        alert("Error saving product: " + error.message);
        console.error(error);
    }
  };

  const addSize = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && sizeInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        sizes: [...(prev.sizes || []), sizeInput.trim()]
      }));
      setSizeInput('');
    }
  };

  const removeSize = (sizeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes?.filter(s => s !== sizeToRemove)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        
        setFormData(prev => ({ ...prev, image: data.publicUrl }));
    } catch (error: any) {
        alert("Error uploading image: " + error.message);
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="bg-theme-dark/50 backdrop-blur-md rounded-2xl border border-gray-800 shadow-3d overflow-hidden">
      <div className="p-8 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
           <h2 className="font-display font-black text-3xl text-white italic">Product Inventory</h2>
           <p className="text-gray-500 text-sm mt-1">Manage your storefront items and stock levels.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleAddNew}
            className="bg-theme-accent text-white px-8 py-4 rounded-xl font-black text-lg shadow-neon hover:bg-theme-accent-hover transition flex items-center gap-3 transform hover:-translate-y-1 active:scale-95"
          >
            <Plus size={24} /> ADD PRODUCT
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
              <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
              <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
              <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {products.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-gray-500 font-bold text-xl">
                        No products found. Start adding your gear!
                    </td>
                </tr>
            ) : (
                products.map(product => (
                <tr key={product.id} className="hover:bg-gray-800/40 transition group">
                    <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="relative">
                            <img className="h-16 w-16 rounded-xl object-cover border border-gray-700 shadow-lg group-hover:scale-110 transition" src={product.image} alt="" />
                            {product.featured && (
                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black p-1 rounded-full shadow-lg">
                                    <Tag size={10} className="fill-black" />
                                </div>
                            )}
                        </div>
                        <div className="ml-5">
                            <div className="text-lg font-black text-white group-hover:text-theme-accent transition">{product.name}</div>
                            <div className="text-xs text-gray-500 font-mono">ID: {product.id.slice(0, 8)}...</div>
                        </div>
                    </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-300 bg-gray-900/50 px-3 py-1 rounded-lg border border-gray-800">{product.category}</span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-lg font-black text-white">৳{product.price}</td>
                    <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`px-4 py-1.5 text-xs font-black rounded-full border ${product.stock < 5 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-green-500/10 text-green-500 border-green-500/30'}`}>
                        {product.stock} UNITS
                    </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleEdit(product); }} 
                            className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition shadow-inner-3d"
                            disabled={deletingId === product.id}
                        >
                            <Edit size={20} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }} 
                            className={`p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition shadow-inner-3d ${deletingId === product.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={deletingId === product.id}
                        >
                            {deletingId === product.id ? <Loader size={20} className="animate-spin" /> : <Trash2 size={20} />}
                        </button>
                    </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-theme-dark w-full max-w-5xl rounded-3xl border border-gray-700 shadow-2xl overflow-y-auto max-h-[95vh] animate-scale-in custom-scrollbar">
            <div className="p-8 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-theme-dark z-20 backdrop-blur-md bg-opacity-95">
              <h3 className="font-display font-black text-3xl text-white flex items-center gap-3 italic">
                 {editingProduct ? <Edit size={32} className="text-theme-accent"/> : <Plus size={32} className="text-theme-accent"/>}
                 {editingProduct ? 'EDIT MISSION GEAR' : 'INITIALIZE NEW GEAR'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition bg-gray-800 p-3 rounded-full hover:bg-red-500"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-8">
                    <h4 className="text-theme-accent font-black border-b border-gray-800 pb-3 mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.2em]">
                       <Type size={18}/> Core Specifications
                    </h4>
                    
                    <div className="space-y-6">
                        <div>
                        <label className="block text-xs font-black text-gray-500 uppercase mb-3 tracking-widest">Product Title</label>
                        <input 
                            required
                            type="text" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-theme-black border border-gray-700 rounded-2xl p-4 text-white font-bold text-lg focus:border-theme-accent focus:outline-none focus:ring-2 focus:ring-theme-accent/20 transition shadow-inner-3d"
                            placeholder="Enter gear name..."
                        />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                            <label className="block text-xs font-black text-gray-500 uppercase mb-3 tracking-widest">Price (৳)</label>
                            <div className="relative">
                                <div className="absolute left-4 top-4 text-gray-500"><DollarSign size={20} /></div>
                                <input 
                                    required
                                    type="number" 
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                                    className="w-full bg-theme-black border border-gray-700 rounded-2xl p-4 pl-12 text-white font-black text-xl focus:border-theme-accent focus:outline-none focus:ring-2 focus:ring-theme-accent/20 transition shadow-inner-3d"
                                />
                            </div>
                            </div>
                            <div>
                            <label className="block text-xs font-black text-gray-500 uppercase mb-3 tracking-widest">Stock Units</label>
                            <div className="relative">
                                <div className="absolute left-4 top-4 text-gray-500"><Box size={20} /></div>
                                <input 
                                    required
                                    type="number" 
                                    value={formData.stock}
                                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                                    className="w-full bg-theme-black border border-gray-700 rounded-2xl p-4 pl-12 text-white font-black text-xl focus:border-theme-accent focus:outline-none focus:ring-2 focus:ring-theme-accent/20 transition shadow-inner-3d"
                                />
                            </div>
                            </div>
                        </div>

                        <div>
                        <label className="block text-xs font-black text-gray-500 uppercase mb-3 tracking-widest">Category Deployment</label>
                        <div className="relative">
                            <div className="absolute left-4 top-4 text-gray-500"><Tag size={20} /></div>
                            <select 
                                required
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                className="w-full bg-theme-black border border-gray-700 rounded-2xl p-4 pl-12 text-white font-bold focus:border-theme-accent focus:outline-none focus:ring-2 focus:ring-theme-accent/20 transition appearance-none"
                            >
                                <option value="" disabled>Choose Category</option>
                                {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        </div>

                        <div>
                        <label className="block text-xs font-black text-gray-500 uppercase mb-3 tracking-widest">Origin Story / Description</label>
                        <textarea 
                            required
                            rows={5}
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className="w-full bg-theme-black border border-gray-700 rounded-2xl p-4 text-white focus:border-theme-accent focus:outline-none focus:ring-2 focus:ring-theme-accent/20 transition text-base leading-relaxed"
                            placeholder="What makes this gear unique?"
                        />
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    <div>
                        <h4 className="text-theme-accent font-black border-b border-gray-800 pb-3 mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.2em]">
                           <Layers size={18}/> Mission Attributes
                        </h4>
                        
                        <div className="space-y-8">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase mb-3 tracking-widest">Available Sizes</label>
                                <input 
                                    type="text" 
                                    value={sizeInput}
                                    onChange={e => setSizeInput(e.target.value)}
                                    onKeyDown={addSize}
                                    placeholder="Type size and press Enter..."
                                    className="w-full bg-theme-black border border-gray-700 rounded-2xl p-4 text-white focus:border-theme-accent focus:outline-none mb-4"
                                />
                                <div className="flex flex-wrap gap-3">
                                {formData.sizes?.map(size => (
                                    <span key={size} className="bg-theme-accent/10 text-theme-accent border border-theme-accent/30 px-5 py-2 rounded-xl font-black text-sm flex items-center gap-3 animate-scale-in">
                                    {size}
                                    <button type="button" onClick={() => removeSize(size)} className="text-theme-accent hover:text-white transition"><X size={16} /></button>
                                    </span>
                                ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-5 p-6 bg-theme-black/80 border border-gray-800 rounded-2xl shadow-inner-3d group cursor-pointer" onClick={() => setFormData({...formData, featured: !formData.featured})}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition ${formData.featured ? 'bg-theme-accent border-theme-accent text-white shadow-neon' : 'bg-transparent border-gray-700 text-transparent'}`}>
                                    <CheckCircle size={20} />
                                </div>
                                <div>
                                    <label htmlFor="featured" className="text-white font-black text-lg block cursor-pointer">Featured Elite Drop</label>
                                    <p className="text-gray-500 text-xs">This product will appear on the homepage.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-theme-accent font-black border-b border-gray-800 pb-3 mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.2em]">
                            <ImageIcon size={18}/> Gear Visualization
                        </h4>
                        <div className="bg-theme-black/50 p-8 rounded-3xl border border-gray-800 space-y-6">
                            <div 
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                className={`w-full bg-theme-black border-4 border-dashed border-gray-700 rounded-3xl p-12 text-center cursor-pointer hover:border-theme-accent hover:bg-theme-accent/5 transition-all flex flex-col items-center justify-center gap-4 group ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader size={48} className="text-theme-accent animate-spin" />
                                        <span className="text-theme-accent font-black uppercase tracking-widest">UPLOADING...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center group-hover:bg-theme-accent group-hover:text-white transition-all text-gray-500 shadow-xl">
                                            <Upload size={40} />
                                        </div>
                                        <div>
                                            <span className="text-white font-black text-xl block mb-2">DEPLOY IMAGE</span>
                                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Drag & drop or click to upload</span>
                                        </div>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleImageUpload} 
                                    accept="image/*" 
                                    className="hidden" 
                                    disabled={uploading}
                                />
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-32 h-32 bg-theme-black rounded-2xl border-2 border-gray-700 overflow-hidden flex items-center justify-center relative shadow-2xl shrink-0 group">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-125 transition duration-500" />
                                    ) : (
                                        <div className="text-center text-gray-700 p-2">
                                            <ImageIcon size={32} className="mx-auto mb-1 opacity-20"/>
                                            <span className="text-[10px] font-black uppercase tracking-tighter">NO IMAGE</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-black text-gray-600 uppercase mb-2 tracking-[0.2em]">Source Intel (Image URL)</label>
                                    <input 
                                        type="text" 
                                        placeholder="Or paste external link here..."
                                        value={formData.image}
                                        onChange={e => setFormData({...formData, image: e.target.value})}
                                        className="w-full bg-theme-black border border-gray-700 rounded-xl p-3 text-xs text-white focus:border-theme-accent focus:outline-none transition shadow-inner-3d"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              <div className="flex justify-end gap-6 pt-10 border-t border-gray-800 sticky bottom-0 bg-theme-dark pb-6 z-10 backdrop-blur-md">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-10 py-5 rounded-2xl text-gray-500 font-black uppercase tracking-widest hover:text-white hover:bg-gray-800 transition transform active:scale-95"
                >
                  ABORT
                </button>
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="bg-theme-accent text-white px-16 py-5 rounded-2xl font-black text-xl shadow-neon hover:bg-theme-accent-hover transition-all disabled:opacity-50 flex items-center gap-4 transform hover:-translate-y-1 active:scale-95 hover:shadow-[0_0_50px_rgba(59,130,246,0.6)]"
                >
                  {editingProduct ? <><Edit size={24}/> UPDATE GEAR</> : <><Plus size={24}/> INITIALIZE GEAR</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
