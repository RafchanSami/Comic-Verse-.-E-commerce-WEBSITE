import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/mockDb';
import { useAuth } from '../context/AuthContext';

export const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // If user is not authenticated (meaning the link didn't log them in automatically or expired),
  // they shouldn't be here. However, Supabase recovery links usually auto-login.
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    try {
      await db.updateUserPassword(password);
      alert("Password updated successfully! You can now login with your new password.");
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-theme-dark/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-gray-800 shadow-3d-hover w-full max-w-md relative z-10">
        <h2 className="font-display font-black text-3xl text-center mb-2 text-white italic">NEW PASSWORD</h2>
        <p className="text-center text-gray-400 font-bold mb-8">
          Secure your account with a fresh secret key.
        </p>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-4 text-sm font-bold text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-400">New Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-theme-black border border-gray-700 rounded-xl p-3 text-white focus:border-theme-accent focus:ring-1 focus:ring-theme-accent focus:outline-none transition shadow-inner-3d"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-gray-400">Confirm Password</label>
            <input 
              type="password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-theme-black border border-gray-700 rounded-xl p-3 text-white focus:border-theme-accent focus:ring-1 focus:ring-theme-accent focus:outline-none transition shadow-inner-3d"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-theme-accent text-white font-bold py-4 rounded-xl text-lg shadow-neon hover:bg-theme-accent-hover transition transform hover:-translate-y-1 disabled:opacity-50"
          >
            {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
          </button>
        </form>
      </div>
    </div>
  );
};