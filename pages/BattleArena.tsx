import React from 'react';
import { Link } from 'react-router-dom';
import { useArena } from '../context/ArenaContext';
import { useCart } from '../context/CartContext';
import { X, Shield, Zap, Wind, Activity, Swords, ShoppingCart, PlusCircle } from 'lucide-react';

const StatComparison = ({ label, val1, val2, icon: Icon, color }: any) => {
  const total = 100;
  const win1 = val1 > val2;
  const win2 = val2 > val1;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
        <span className={win1 ? 'text-white' : ''}>{val1}</span>
        <span className="flex items-center gap-2"><Icon size={16} className={color} /> {label}</span>
        <span className={win2 ? 'text-white' : ''}>{val2}</span>
      </div>
      <div className="flex h-4 bg-gray-800 rounded-full overflow-hidden relative">
        {/* Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-900 z-10"></div>
        
        {/* Left Bar (Reversed) */}
        <div className="w-1/2 flex justify-end bg-gray-900/50">
           <div 
             className={`h-full transition-all duration-1000 ${color.replace('text', 'bg')} ${win1 ? 'opacity-100' : 'opacity-60'}`}
             style={{ width: `${val1}%` }}
           ></div>
        </div>
        
        {/* Right Bar */}
        <div className="w-1/2 flex justify-start bg-gray-900/50">
           <div 
             className={`h-full transition-all duration-1000 ${color.replace('text', 'bg')} ${win2 ? 'opacity-100' : 'opacity-60'}`}
             style={{ width: `${val2}%` }}
           ></div>
        </div>
      </div>
    </div>
  );
};

export const BattleArena = () => {
  const { fighters, removeFighter } = useArena();
  const { addToCart } = useCart();

  if (fighters.length === 0) {
    return (
      <div className="min-h-screen bg-theme-black flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-theme-dark rounded-full flex items-center justify-center mb-6 animate-pulse border border-gray-700">
           <Swords size={48} className="text-gray-600" />
        </div>
        <h1 className="font-display font-black text-4xl md:text-6xl text-white italic mb-4">THE ARENA IS <span className="text-gray-600">EMPTY</span></h1>
        <p className="text-gray-400 text-lg mb-8 max-w-md">Select two pieces of gear from the shop to compare their stats and find the ultimate loadout.</p>
        <Link to="/shop" className="px-8 py-4 bg-theme-accent text-white font-bold rounded-xl shadow-neon hover:bg-theme-accent-hover transition flex items-center gap-2">
           <PlusCircle size={20} /> SELECT GEAR
        </Link>
      </div>
    );
  }

  const p1 = fighters[0];
  const p2 = fighters[1];

  return (
    <div className="min-h-screen bg-theme-black py-12 px-4 relative overflow-hidden">
       {/* Background Effects */}
       <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none"></div>

       <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
             <h1 className="font-display font-black text-5xl text-white italic mb-2">BATTLE <span className="text-red-500">ARENA</span></h1>
             <p className="text-gray-400">Compare specs to choose your weapon.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
             
             {/* Fighter 1 */}
             <div className="bg-theme-dark/80 backdrop-blur-md rounded-2xl border border-theme-accent/30 p-6 shadow-[0_0_30px_rgba(59,130,246,0.2)] relative group">
                <button onClick={() => removeFighter(p1.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"><X size={24} /></button>
                <div className="aspect-square bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 mb-6 flex items-center justify-center">
                   <img src={p1.image} alt={p1.name} className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition duration-500" />
                </div>
                <h2 className="font-display font-black text-2xl text-white mb-1 italic">{p1.name}</h2>
                <p className="text-theme-accent font-bold text-xl mb-6">৳{p1.price}</p>
                <button 
                  onClick={() => addToCart(p1)} 
                  className="w-full py-3 bg-gray-800 hover:bg-theme-accent text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                >
                   <ShoppingCart size={18} /> Choose This
                </button>
             </div>

             {/* VS Stats */}
             <div className="order-first md:order-none mb-8 md:mb-0">
                {p2 ? (
                   <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                      <div className="text-center mb-8">
                         <span className="font-display font-black text-6xl text-transparent bg-clip-text bg-gradient-to-r from-theme-accent to-red-500 italic">VS</span>
                      </div>
                      
                      <StatComparison label="Speed" val1={p1.heroStats?.speed || 50} val2={p2.heroStats?.speed || 50} icon={Wind} color="text-yellow-400" />
                      <StatComparison label="Durability" val1={p1.heroStats?.durability || 50} val2={p2.heroStats?.durability || 50} icon={Shield} color="text-blue-400" />
                      <StatComparison label="Stealth" val1={p1.heroStats?.stealth || 50} val2={p2.heroStats?.stealth || 50} icon={Zap} color="text-purple-400" />
                      <StatComparison label="Comfort" val1={p1.heroStats?.comfort || 50} val2={p2.heroStats?.comfort || 50} icon={Activity} color="text-green-400" />
                      
                      <div className="text-center mt-6 text-xs font-bold text-gray-500 uppercase">
                         Comparing Base Stats
                      </div>
                   </div>
                ) : (
                   <div className="text-center p-8 border-2 border-dashed border-gray-800 rounded-2xl">
                      <p className="text-gray-500 font-bold mb-4">Awaiting Challenger...</p>
                      <Link to="/shop" className="inline-block px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition">
                         + Add Opponent
                      </Link>
                   </div>
                )}
             </div>

             {/* Fighter 2 */}
             {p2 ? (
                <div className="bg-theme-dark/80 backdrop-blur-md rounded-2xl border border-red-500/30 p-6 shadow-[0_0_30px_rgba(239,68,68,0.2)] relative group">
                   <button onClick={() => removeFighter(p2.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"><X size={24} /></button>
                   <div className="aspect-square bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 mb-6 flex items-center justify-center">
                      <img src={p2.image} alt={p2.name} className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition duration-500" />
                   </div>
                   <h2 className="font-display font-black text-2xl text-white mb-1 italic">{p2.name}</h2>
                   <p className="text-red-500 font-bold text-xl mb-6">৳{p2.price}</p>
                   <button 
                     onClick={() => addToCart(p2)} 
                     className="w-full py-3 bg-gray-800 hover:bg-red-600 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                   >
                      <ShoppingCart size={18} /> Choose This
                   </button>
                </div>
             ) : (
                <div className="hidden md:flex aspect-[3/4] border-2 border-dashed border-gray-800 rounded-2xl items-center justify-center">
                   <span className="text-gray-600 font-bold uppercase tracking-widest">Empty Slot</span>
                </div>
             )}

          </div>
       </div>
    </div>
  );
};