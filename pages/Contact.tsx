import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, AlertTriangle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { db } from '../services/mockDb';
import { EmailConfig } from '../types';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [config, setConfig] = useState<EmailConfig | null>(null);

  useEffect(() => {
    db.getEmailConfig().then(setConfig);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!config || !config.serviceId) {
       alert("Email service is not configured by Admin yet.");
       return;
    }

    setStatus('SENDING');

    try {
      await emailjs.send(
        config.serviceId,
        config.templateId,
        {
           from_name: formData.name,
           from_email: formData.email,
           message: formData.message,
           reply_to: formData.email
        },
        config.publicKey
      );
      setStatus('SUCCESS');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    }
  };

  return (
    <div className="min-h-screen bg-theme-black py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-display font-black text-5xl text-white italic mb-4">CONNECT <span className="text-theme-accent">US</span></h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Have a question or just want to say hi? Our team of superheroes is ready to assist you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
             <div className="bg-theme-dark/50 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-3d hover:border-theme-accent/50 transition duration-300">
                <div className="w-12 h-12 bg-theme-accent/10 rounded-xl flex items-center justify-center text-theme-accent mb-6">
                   <Mail size={24} />
                </div>
                <h3 className="font-bold text-xl text-white mb-2">Email Us</h3>
                <p className="text-gray-400 mb-4">For general inquiries and support.</p>
                <a href="mailto:support@comicverse.com" className="text-theme-accent font-bold hover:text-white transition">support@comicverse.com</a>
             </div>

             <div className="bg-theme-dark/50 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-3d hover:border-theme-accent/50 transition duration-300">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-6">
                   <Phone size={24} />
                </div>
                <h3 className="font-bold text-xl text-white mb-2">Call Us</h3>
                <p className="text-gray-400 mb-4">Mon-Fri from 9am to 6pm.</p>
                <a href="tel:+8801XXXXXXXXX" className="text-purple-500 font-bold hover:text-white transition">+880 1XXX-XXXXXX</a>
             </div>

             <div className="bg-theme-dark/50 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-3d hover:border-theme-accent/50 transition duration-300">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mb-6">
                   <MapPin size={24} />
                </div>
                <h3 className="font-bold text-xl text-white mb-2">Visit HQ</h3>
                <p className="text-gray-400">123 Hero Avenue, Metropolis City, Comic World.</p>
             </div>
          </div>

          {/* Contact Form */}
          <div className="bg-theme-dark rounded-3xl p-8 md:p-12 border border-gray-800 shadow-3d relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-theme-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <h2 className="font-display font-bold text-3xl text-white mb-8 relative z-10">Send a Message</h2>
             
             {status === 'SUCCESS' ? (
               <div className="bg-green-500/20 border border-green-500/50 p-6 rounded-xl text-center">
                 <h3 className="text-green-500 font-bold text-xl mb-2">Message Sent!</h3>
                 <p className="text-gray-300">We'll get back to you faster than a speeding bullet.</p>
                 <button onClick={() => setStatus('IDLE')} className="mt-4 text-sm font-bold text-white underline">Send another</button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                 {!config && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 p-4 rounded-xl flex items-center gap-2 text-sm">
                       <AlertTriangle size={18} /> Admin has not configured SMTP/EmailJS yet. Form will not send.
                    </div>
                 )}
                 <div>
                   <label className="block text-sm font-bold text-gray-400 mb-2">Your Name</label>
                   <input 
                     required 
                     type="text" 
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     className="w-full bg-theme-black border border-gray-700 rounded-xl p-4 text-white focus:border-theme-accent focus:ring-1 focus:ring-theme-accent focus:outline-none transition shadow-inner-3d"
                     placeholder="John Doe"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-400 mb-2">Email Address</label>
                   <input 
                     required 
                     type="email" 
                     value={formData.email}
                     onChange={e => setFormData({...formData, email: e.target.value})}
                     className="w-full bg-theme-black border border-gray-700 rounded-xl p-4 text-white focus:border-theme-accent focus:ring-1 focus:ring-theme-accent focus:outline-none transition shadow-inner-3d"
                     placeholder="john@example.com"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-400 mb-2">Message</label>
                   <textarea 
                     required 
                     rows={5} 
                     value={formData.message}
                     onChange={e => setFormData({...formData, message: e.target.value})}
                     className="w-full bg-theme-black border border-gray-700 rounded-xl p-4 text-white focus:border-theme-accent focus:ring-1 focus:ring-theme-accent focus:outline-none transition shadow-inner-3d"
                     placeholder="How can we help you?"
                   ></textarea>
                 </div>
                 
                 {status === 'ERROR' && (
                    <p className="text-red-500 text-sm font-bold text-center">Failed to send message. Please try again.</p>
                 )}

                 <button 
                   type="submit" 
                   disabled={status === 'SENDING' || !config}
                   className="w-full bg-theme-accent text-white font-bold py-4 rounded-xl text-lg shadow-neon hover:bg-theme-accent-hover transition transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {status === 'SENDING' ? 'SENDING...' : <><Send size={20} /> SEND MESSAGE</>}
                 </button>
               </form>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};