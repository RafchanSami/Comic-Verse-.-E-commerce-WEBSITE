import React, { useState } from 'react';
import { PromoCode } from '../../types';
import { db } from '../../services/mockDb';
import { Trash2, Plus, X, Power, PowerOff } from 'lucide-react';

interface Props {
  promos: PromoCode[];
  onUpdate: () => void;
}

export const AdminPromos = ({ promos, onUpdate }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<PromoCode>>({
    code: '',
    type: 'PERCENTAGE',
    value: 0,
    isActive: true
  });

  const handleAddNew = () => {
    setFormData({ code: '', type: 'PERCENTAGE', value: 0, isActive: true });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this promo code?')) {
      await db.deletePromo(id);
      onUpdate();
    }
  };

  const handleToggle = async (id: string) => {
    await db.togglePromoStatus(id);
    onUpdate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.createPromo(formData as Omit<PromoCode, 'id'>);
    setIsModalOpen(false);
    onUpdate();
  };

  return (
    <div className="bg-theme-dark/50 backdrop-blur-md rounded-2xl border border-gray-800 shadow-3d overflow-hidden flex flex-col h-[calc(100vh-200px)]">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <h2 className="font-display font-bold text-xl text-white">Discount Management</h2>
        <button onClick={handleAddNew} className="bg-theme-accent text-white px-4 py-2 rounded-lg font-bold text-sm shadow-neon hover:bg-theme-accent-hover transition flex items-center gap-2">
          <Plus size={16} /> Add Promo
        </button>
      </div>

      <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-800 relative">
          <thead className="bg-gray-900/90 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {promos.map(promo => (
              <tr key={promo.id} className="hover:bg-gray-800/30 transition">
                <td className="px-6 py-4 font-mono font-bold text-white tracking-wider">{promo.code}</td>
                <td className="px-6 py-4 text-gray-300 text-sm">{promo.type}</td>
                <td className="px-6 py-4 text-theme-accent font-bold">
                  {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `৳${promo.value}`}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${promo.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {promo.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleToggle(promo.id)} className={`mr-4 transition ${promo.isActive ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}>
                    {promo.isActive ? <PowerOff size={18} /> : <Power size={18} />}
                  </button>
                  <button onClick={() => handleDelete(promo.id)} className="text-gray-500 hover:text-red-500 transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-theme-dark w-full max-w-6xl rounded-2xl border border-gray-700 shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-display font-bold text-2xl text-white">Create Promo Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Code</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full bg-theme-black border border-gray-700 rounded-lg p-4 text-white focus:border-theme-accent focus:outline-none text-lg" placeholder="e.g. SALE50" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full bg-theme-black border border-gray-700 rounded-lg p-4 text-white focus:border-theme-accent focus:outline-none text-lg">
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Value</label>
                  <input required type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="w-full bg-theme-black border border-gray-700 rounded-lg p-4 text-white focus:border-theme-accent focus:outline-none text-lg" />
                </div>
              </div>
              <button type="submit" className="w-full bg-theme-accent text-white py-4 rounded-xl font-bold mt-4 shadow-neon hover:bg-theme-accent-hover transition text-lg">Create Promo</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};