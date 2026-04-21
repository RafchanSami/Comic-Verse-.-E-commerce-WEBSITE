import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/mockDb';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

type ViewState = 'login' | 'register' | 'forgot';

export const Login = () => {
  const [view, setView] = useState<ViewState>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  
  // Ref to track if component is mounted to prevent state updates on unmount
  const isMounted = useRef(true);
  
  const { login, isAuthenticated } = useAuth(); 
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // If user is already logged in, redirect them
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  // Handle countdown timer
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (view === 'login') {
        const user = await db.login(email, password);
        
        if (!isMounted.current) return;

        if (user) {
          // Success: Context login + Navigation handled by useEffect or here
          login(user);
          // We don't need to setLoading(false) here because we are navigating away
        } else {
          setError('Invalid email or password');
          setLoading(false);
        }
      } else if (view === 'register') {
        const newUser = await db.register(name, email, password);
        if (isMounted.current) {
            login(newUser);
            // navigate happens via useEffect when isAuthenticated becomes true
        }
      } else if (view === 'forgot') {
        if (cooldown > 0) {
          setLoading(false);
          return;
        }
        await db.sendPasswordResetEmail(email);
        if (isMounted.current) {
            setSuccessMsg('Password reset link has been sent to your email.');
            setCooldown(60);
            setLoading(false);
        }
      }
    } catch (err: any) {
      if (!isMounted.current) return;

      let msg = err.message || 'An error occurred';
      const msgLower = msg.toLowerCase();
      
      if (msgLower.includes('rate limit') || msgLower.includes('too many requests')) {
        msg = 'Too many attempts. Please wait a minute before trying again.';
        if (view === 'forgot') setCooldown(60);
      }

      setError(msg);
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'login': return 'WELCOME BACK';
      case 'register': return 'JOIN THE SQUAD';
      case 'forgot': return 'RESET PASSWORD';
      default: return '';
    }
  };

  const getDescription = () => {
    switch (view) {
      case 'login': return 'Enter your credentials to access your gear.';
      case 'register': return 'Create an account to start your journey.';
      case 'forgot': return 'Enter your email to receive a reset link.';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-theme-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambience */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-theme-dark/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-gray-800 shadow-3d-hover w-full max-w-md relative z-10">
        
        {view === 'forgot' && (
           <button onClick={() => { setView('login'); setError(''); }} className="flex items-center text-gray-400 hover:text-white mb-4 text-sm font-bold transition">
             <ArrowLeft size={16} className="mr-1" /> Back to Login
           </button>
        )}

        <h2 className="font-display font-black text-4xl text-center mb-2 text-white italic">{getTitle()}</h2>
        <p className="text-center text-gray-400 font-bold mb-8">
          {getDescription()}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-4 text-sm font-bold text-center animate-pulse flex flex-col items-center gap-1">
             <div className="flex items-center gap-2">
               <AlertTriangle size={16} /> <span>{error}</span>
             </div>
          </div>
        )}
        
        {successMsg && <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-xl mb-4 text-sm font-bold text-center">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-400">Hero Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-theme-black border border-gray-700 rounded-xl p-3 text-white focus:border-theme-accent focus:ring-1 focus:ring-theme-accent focus:outline-none transition shadow-inner-3d"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-400">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-theme-black border border-gray-700 rounded-xl p-3 text-white focus:border-theme-accent focus:ring-1 focus:ring-theme-accent focus:outline-none transition shadow-inner-3d"
            />
          </div>

          {view !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-bold text-gray-400">Secret Password</label>
                 {view === 'login' && (
                   <button type="button" onClick={() => { setView('forgot'); setError(''); }} className="text-xs text-theme-accent hover:text-white font-bold transition">
                     Forgot?
                   </button>
                 )}
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-theme-black border border-gray-700 rounded-xl p-3 text-white focus:border-theme-accent focus:ring-1 focus:ring-theme-accent focus:outline-none transition shadow-inner-3d"
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || (view === 'forgot' && cooldown > 0)}
            className="w-full bg-theme-accent text-white font-bold py-4 rounded-xl text-lg shadow-neon hover:bg-theme-accent-hover hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
          >
            {loading ? 'PROCESSING...' : (
              view === 'login' ? 'LOGIN' : 
              view === 'register' ? 'REGISTER' : 
              cooldown > 0 ? `RETRY IN ${cooldown}s` : 'SEND RESET LINK'
            )}
          </button>
        </form>

        {view !== 'forgot' && (
          <div className="mt-8 text-center">
            <button 
              onClick={() => { setView(view === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-sm font-bold text-gray-400 hover:text-theme-accent transition"
            >
              {view === 'login' ? "New here? Create an account" : "Already have an account? Login"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};