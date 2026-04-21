import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { EmailConfig } from '../../types';
import { Save, Lock, Mail } from 'lucide-react';

export const AdminSettings = () => {
  const [config, setConfig] = useState<EmailConfig>({
    serviceId: '',
    templateId: '',
    publicKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    db.getEmailConfig().then(cfg => {
      if (cfg) setConfig(cfg);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      await db.saveEmailConfig(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-theme-dark/50 backdrop-blur-md rounded-2xl border border-gray-800 shadow-3d overflow-hidden max-w-2xl">
      <div className="p-6 border-b border-gray-800">
        <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
           <Mail size={24} className="text-theme-accent" />
           Email Service Configuration
        </h2>
        <p className="text-gray-500 text-sm mt-1">Configure SMTP/EmailJS settings for contact forms and notifications.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl text-yellow-500 text-sm">
           <strong>Note:</strong> We use EmailJS to securely handle emails from the client side. 
           Please sign up at <a href="https://www.emailjs.com" target="_blank" rel="noreferrer" className="underline font-bold">emailjs.com</a> and enter your API keys below.
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Service ID</label>
          <div className="relative">
             <input 
               required
               type="text" 
               value={config.serviceId}
               onChange={e => setConfig({...config, serviceId: e.target.value})}
               className="w-full bg-theme-black border border-gray-700 rounded-lg p-3 pl-10 text-white focus:border-theme-accent focus:outline-none font-mono"
               placeholder="service_xxxxx"
             />
             <div className="absolute left-3 top-3.5 text-gray-600"><Lock size={16} /></div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Template ID (Contact Form)</label>
          <div className="relative">
             <input 
               required
               type="text" 
               value={config.templateId}
               onChange={e => setConfig({...config, templateId: e.target.value})}
               className="w-full bg-theme-black border border-gray-700 rounded-lg p-3 pl-10 text-white focus:border-theme-accent focus:outline-none font-mono"
               placeholder="template_xxxxx"
             />
             <div className="absolute left-3 top-3.5 text-gray-600"><Lock size={16} /></div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Public Key</label>
          <div className="relative">
             <input 
               required
               type="password" 
               value={config.publicKey}
               onChange={e => setConfig({...config, publicKey: e.target.value})}
               className="w-full bg-theme-black border border-gray-700 rounded-lg p-3 pl-10 text-white focus:border-theme-accent focus:outline-none font-mono"
               placeholder="xxxxxxxxxxxxxxxxx"
             />
             <div className="absolute left-3 top-3.5 text-gray-600"><Lock size={16} /></div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
           <button 
             type="submit" 
             disabled={loading}
             className="bg-theme-accent text-white px-8 py-3 rounded-xl font-bold shadow-neon hover:bg-theme-accent-hover transition flex items-center gap-2 disabled:opacity-50"
           >
             {loading ? 'Saving...' : <><Save size={18} /> Save Settings</>}
           </button>
           
           {saved && <span className="text-green-500 font-bold animate-pulse">Configuration Saved!</span>}
        </div>

      </form>
    </div>
  );
};