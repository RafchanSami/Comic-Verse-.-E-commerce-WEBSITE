import React from 'react';
import { Shield, Zap, Star, Code, PenTool, Target, Terminal, Cpu } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-theme-black text-white">
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden border-b border-gray-800">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-theme-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="font-display font-black text-6xl md:text-7xl italic mb-6 leading-tight">
            THE <span className="text-theme-accent">ORIGIN</span> STORY
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Every hero has a beginning. Ours started with a vision to revolutionize footwear for the modern vigilante. We don't just sell shoes; we craft armor for your adventures.
          </p>
        </div>
      </div>

      {/* The Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
         <div className="text-center mb-16">
            <h2 className="font-display font-black text-4xl text-white italic mb-2">MEET THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-accent to-purple-500">CREATORS</span></h2>
            <p className="text-gray-500">The minds behind the Comic Verse revolution.</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Founder 1 */}
            <div className="bg-theme-dark/50 backdrop-blur-md rounded-3xl border border-gray-800 p-6 shadow-3d hover:border-theme-accent transition duration-500 group relative overflow-hidden flex flex-col">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition">
                  <Star size={100} />
               </div>
               
               <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 border-2 border-gray-700 group-hover:border-theme-accent transition relative shadow-2xl">
                  <div className="absolute inset-0 bg-theme-accent/10 group-hover:bg-transparent transition z-10"></div>
                  <img 
                    src="https://i.imgur.com/pJhq1MK.jpeg" 
                    alt="The Visionary" 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  />
               </div>
               
               <div className="relative z-10 mt-auto">
                  <h3 className="font-display font-black text-3xl italic text-white mb-2">Kauser Aahamed Nafis</h3>
                  <div className="flex items-center gap-3 mb-4">
                     <span className="text-theme-accent font-bold uppercase tracking-widest text-xs bg-theme-accent/10 px-3 py-1 rounded-lg">Story Writer And Art</span>
                  </div>
                  
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    "Crafting the narrative one step at a time."
                  </p>
                  
                  <div className="flex gap-2 flex-wrap">
                     <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300 bg-gray-800 border border-gray-700 px-2 py-1.5 rounded-lg">
                        <PenTool size={12} className="text-theme-accent" /> Story Writer And Art
                     </div>
                     <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300 bg-gray-800 border border-gray-700 px-2 py-1.5 rounded-lg">
                        <Target size={12} className="text-theme-accent" /> Leadership
                     </div>
                  </div>
               </div>
            </div>

            {/* Founder 2 */}
            <div className="bg-theme-dark/50 backdrop-blur-md rounded-3xl border border-gray-800 p-6 shadow-3d hover:border-purple-500 transition duration-500 group relative overflow-hidden flex flex-col">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition">
                  <Zap size={100} />
               </div>

               <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 border-2 border-gray-700 group-hover:border-purple-500 transition relative shadow-2xl">
                  <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-transparent transition z-10"></div>
                  <img 
                    src="https://i.imgur.com/GzKwizM.jpeg" 
                    alt="The Strategist" 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  />
               </div>
               
               <div className="relative z-10 mt-auto">
                  <h3 className="font-display font-black text-3xl italic text-white mb-2">Ifsan Al Ayas</h3>
                  <div className="flex items-center gap-3 mb-4">
                     <span className="text-purple-500 font-bold uppercase tracking-widest text-xs bg-purple-500/10 px-3 py-1 rounded-lg">Designer</span>
                  </div>
                  
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    "Designing the future of footwear."
                  </p>
                  
                  <div className="flex gap-2 flex-wrap">
                     <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300 bg-gray-800 border border-gray-700 px-2 py-1.5 rounded-lg">
                        <Shield size={12} className="text-purple-500" /> Designer
                     </div>
                  </div>
               </div>
            </div>

            {/* Founder 3 */}
            <div className="bg-theme-dark/50 backdrop-blur-md rounded-3xl border border-gray-800 p-6 shadow-3d hover:border-cyan-400 transition duration-500 group relative overflow-hidden flex flex-col">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition">
                  <Terminal size={100} />
               </div>

               <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 border-2 border-gray-700 group-hover:border-cyan-400 transition relative shadow-2xl bg-gray-900">
                  <div className="absolute inset-0 bg-cyan-400/10 group-hover:bg-transparent transition z-10"></div>
                  <img 
                    src="https://avatars.githubusercontent.com/u/246033439?v=4" 
                    alt="The Architect" 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  />
               </div>
               
               <div className="relative z-10 mt-auto">
                  <h3 className="font-display font-black text-3xl italic text-white mb-2">Rafchan Sami</h3>
                  <div className="flex items-center gap-3 mb-4">
                     <span className="text-cyan-400 font-bold uppercase tracking-widest text-xs bg-cyan-400/10 px-3 py-1 rounded-lg">Designer And Store Developer</span>
                  </div>
                  
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    "Building the digital infrastructure."
                  </p>
                  
                  <div className="flex gap-2 flex-wrap">
                     <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300 bg-gray-800 border border-gray-700 px-2 py-1.5 rounded-lg">
                        <Code size={12} className="text-cyan-400" /> Development
                     </div>
                     <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300 bg-gray-800 border border-gray-700 px-2 py-1.5 rounded-lg">
                        <Cpu size={12} className="text-cyan-400" /> Designer
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
      
      {/* Values Section */}
      <div className="bg-theme-dark py-20 border-t border-gray-800">
         <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 rounded-2xl bg-theme-black border border-gray-800 hover:border-theme-accent transition group">
                  <Shield size={40} className="text-theme-accent mb-4 group-hover:scale-110 transition" />
                  <h3 className="font-bold text-xl text-white mb-2">Unbreakable Trust</h3>
                  <p className="text-gray-400">We stand behind every pair. Authentic gear for authentic heroes.</p>
               </div>
               <div className="p-8 rounded-2xl bg-theme-black border border-gray-800 hover:border-purple-500 transition group">
                  <Zap size={40} className="text-purple-500 mb-4 group-hover:scale-110 transition" />
                  <h3 className="font-bold text-xl text-white mb-2">Lightning Fast</h3>
                  <p className="text-gray-400">Delivery speeds that would make a speedster jealous.</p>
               </div>
               <div className="p-8 rounded-2xl bg-theme-black border border-gray-800 hover:border-yellow-500 transition group">
                  <Star size={40} className="text-yellow-500 mb-4 group-hover:scale-110 transition" />
                  <h3 className="font-bold text-xl text-white mb-2">Legendary Quality</h3>
                  <p className="text-gray-400">Premium materials fit for saving the world (or just walking).</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};