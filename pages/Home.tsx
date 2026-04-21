import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Star, HelpCircle, Check, Lock, Unlock } from 'lucide-react';
import { Product } from '../types';
import { db } from '../services/mockDb';

const Hero = () => (
  <div className="bg-gradient-to-br from-theme-black via-theme-dark to-gray-900 w-full py-16 md:py-24 relative overflow-hidden">
    {/* Abstract 3D shape or gradient blob */}
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-theme-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <span className="inline-block bg-white/10 backdrop-blur-md border border-white/10 text-theme-accent px-4 py-1 font-bold text-sm mb-6 rounded-full shadow-neon">
            NEW COLLECTION 2024
          </span>
          <h1 className="font-display font-black text-6xl md:text-8xl text-white leading-none mb-6 drop-shadow-2xl italic">
            BE THE <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-accent to-purple-500">HERO</span>
          </h1>
          <p className="text-xl font-medium text-gray-400 mb-8 max-w-lg mx-auto md:mx-0">
            Step into action with our exclusive comic-inspired footwear. Built for speed, power, and everyday adventure.
          </p>
          <Link to="/shop" className="inline-flex items-center px-8 py-4 bg-theme-accent text-white text-xl font-bold rounded-xl shadow-neon hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:bg-theme-accent-hover transition-all transform hover:-translate-y-1">
            SHOP NOW <ArrowRight className="ml-2" />
          </Link>
        </div>
        <div className="md:w-1/2 flex justify-center relative perspective-1000">
          <div className="absolute w-72 h-72 bg-gradient-to-r from-theme-accent to-purple-600 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
          <img 
            src="data:image/jpeg;base64,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" 
            alt="Hero Shoe" 
            className="w-full max-w-md object-contain transform rotate-[-15deg] hover:rotate-[0deg] transition duration-700 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          />
        </div>
      </div>
    </div>
  </div>
);

const QuizSection = () => {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const questions = [
    {
      q: "What's your primary mission strategy?",
      options: [
        { label: "Strike from the shadows", value: "Stealth" },
        { label: "Charge in head-on", value: "Power" },
        { label: "Outrun the enemy", value: "Speed" },
      ]
    },
    {
      q: "Choose your environment:",
      options: [
        { label: "Neon-lit City Night", value: "Tech" },
        { label: "Rugged Wasteland", value: "Durable" },
        { label: "High-Society Gala", value: "Classy" },
      ]
    },
    {
      q: "What's your color vibe?",
      options: [
        { label: "Dark & Brooding", value: "Dark" },
        { label: "Bright & Flashy", value: "Bright" },
        { label: "Tactical Grey", value: "Neutral" },
      ]
    }
  ];

  const handleAnswer = (val: string) => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Simple logic for demo
      const archetypes = ["The Nightstalker", "The Speedster", "The Titan", "The Vigilante"];
      setResult(archetypes[Math.floor(Math.random() * archetypes.length)]);
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setResult(null);
  };

  return (
    <div className="py-20 bg-theme-dark relative overflow-hidden border-t border-b border-gray-800">
       <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
       <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="mb-8">
             <h2 className="font-display font-black text-4xl text-white italic mb-2">FIND YOUR <span className="text-theme-accent">IDENTITY</span></h2>
             <p className="text-gray-400">Answer 3 questions to discover which gear suits your power set.</p>
          </div>

          <div className="bg-theme-black/80 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-3d min-h-[300px] flex flex-col items-center justify-center transition-all duration-500">
             {!result ? (
               <>
                 <div className="w-full bg-gray-800 h-2 rounded-full mb-8 overflow-hidden">
                    <div className="bg-theme-accent h-full transition-all duration-500" style={{ width: `${((step + 1) / questions.length) * 100}%` }}></div>
                 </div>
                 <h3 className="font-bold text-2xl text-white mb-8">{questions[step].q}</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {questions[step].options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleAnswer(opt.value)}
                        className="p-4 rounded-xl border border-gray-600 bg-theme-gray hover:bg-theme-accent hover:border-theme-accent hover:text-white text-gray-300 font-bold transition-all hover:-translate-y-1 shadow-lg"
                      >
                        {opt.label}
                      </button>
                    ))}
                 </div>
               </>
             ) : (
               <div className="animate-fade-in">
                  <div className="w-20 h-20 bg-theme-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon">
                     <Check size={40} className="text-white" />
                  </div>
                  <h3 className="text-gray-400 font-bold uppercase tracking-widest mb-2">Your Archetype Is</h3>
                  <h2 className="font-display font-black text-5xl text-white mb-6 italic">{result.toUpperCase()}</h2>
                  <div className="flex gap-4 justify-center">
                    <Link to="/shop" className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition">View Gear</Link>
                    <button onClick={resetQuiz} className="px-8 py-3 border border-gray-600 text-gray-400 font-bold rounded-xl hover:text-white hover:border-white transition">Retake</button>
                  </div>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

const SecretMission = () => {
  const [answer, setAnswer] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (['shoe', 'footwear', 'shoes', 'boots'].includes(answer.toLowerCase().trim())) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="py-16 bg-theme-black border-t border-gray-900 relative overflow-hidden">
       <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-dashed border-gray-800 p-8 rounded-3xl relative overflow-hidden">
             
             {unlocked ? (
               <div className="animate-fade-in">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-neon">
                     <Unlock size={32} className="text-white" />
                  </div>
                  <h2 className="font-display font-black text-3xl text-white mb-2 italic">MISSION ACCOMPLISHED</h2>
                  <p className="text-gray-400 mb-6">Use this code at checkout for 10% off:</p>
                  <div className="bg-theme-accent/20 border border-theme-accent text-theme-accent font-mono font-bold text-2xl py-4 rounded-xl mb-4 select-all">
                    HERO10
                  </div>
                  <p className="text-xs text-gray-500">Agent, use this wisely.</p>
               </div>
             ) : (
               <div>
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                     <Lock size={32} className="text-gray-400" />
                  </div>
                  <h2 className="font-display font-black text-3xl text-white mb-2 italic">DAILY <span className="text-theme-accent">INTEL</span></h2>
                  <p className="text-gray-400 mb-6 font-mono text-sm border-t border-b border-gray-800 py-4 inline-block">
                    "I have a tongue but cannot speak. <br/>I have a soul but no life. What am I?"
                  </p>
                  
                  <form onSubmit={handleSubmit} className="max-w-xs mx-auto">
                     <div className="relative">
                       <input 
                         type="text" 
                         value={answer}
                         onChange={(e) => setAnswer(e.target.value)}
                         placeholder="Enter Access Code..." 
                         className={`w-full bg-black border ${error ? 'border-red-500 animate-shake' : 'border-gray-700'} rounded-xl py-3 px-4 text-white text-center focus:outline-none focus:border-theme-accent transition font-mono`}
                       />
                       <button type="submit" className="absolute right-2 top-2 bottom-2 bg-gray-800 hover:bg-theme-accent text-white px-3 rounded-lg font-bold transition">
                          <ArrowRight size={16} />
                       </button>
                     </div>
                     {error && <p className="text-red-500 text-xs mt-2 font-bold">ACCESS DENIED. TRY AGAIN.</p>}
                  </form>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color }: any) => (
  <div className={`bg-theme-dark/50 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-3d hover:shadow-3d-hover hover:border-gray-700 transition-all duration-300 h-full flex flex-col items-center text-center group`}>
    <div className={`p-4 rounded-xl ${color} bg-opacity-10 mb-6 text-${color.split('-')[1]}-400 group-hover:scale-110 transition-transform`}>
      <Icon size={32} className={`text-${color.split('-')[1]}-400 drop-shadow-md`} />
    </div>
    <h3 className="font-bold text-2xl mb-3 text-white">{title}</h3>
    <p className="text-gray-400 font-medium">{desc}</p>
  </div>
);

export const Home = () => {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    db.getProducts().then(products => {
      setFeatured(products.filter(p => p.featured).slice(0, 3));
    });
  }, []);

  return (
    <div className="bg-theme-black">
      <Hero />
      
      <section className="py-20 bg-theme-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={Zap} title="SUPER SPEED" desc="Lightweight materials for maximum agility." color="bg-yellow-500" />
            <FeatureCard icon={Shield} title="DURABLE SHIELD" desc="Reinforced soles designed to last forever." color="bg-blue-500" />
            <FeatureCard icon={Star} title="EXCLUSIVE ART" desc="Limited edition comic designs you won't find anywhere else." color="bg-red-500" />
          </div>
        </div>
      </section>

      <QuizSection />
      
      <SecretMission />

      <section className="py-20 bg-gradient-to-b from-theme-black to-theme-dark border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-display font-black text-5xl text-white italic">FEATURED <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-accent to-purple-500">DROPS</span></h2>
            <Link to="/shop" className="hidden md:block font-bold text-gray-400 hover:text-theme-accent transition">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="group block">
                <div className="bg-theme-gray rounded-2xl overflow-hidden shadow-3d hover:shadow-neon transition-all duration-500 border border-gray-800">
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-black p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-theme-accent/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs font-bold text-theme-accent uppercase tracking-wide mb-1">{product.category}</p>
                        <h3 className="font-bold text-xl text-white group-hover:text-theme-accent transition">{product.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-display font-bold text-2xl text-white">৳{product.price}</span>
                      <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-theme-accent transition">
                        <ArrowRight size={18} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/shop" className="inline-block font-bold text-gray-400 hover:text-white border-b border-gray-600">View All Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
};