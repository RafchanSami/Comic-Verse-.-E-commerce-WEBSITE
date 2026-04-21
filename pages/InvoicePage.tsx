import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { db } from '../services/mockDb';
import { Order, PaymentMethod } from '../types';
import { CheckCircle, Printer, ArrowLeft } from 'lucide-react';

export const InvoicePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
        // If passed via navigation state, use it immediately
        if (location.state && location.state.order) {
            setOrder(location.state.order);
            setLoading(false);
            return;
        }

        if (!id) return;
        
        try {
            const foundOrder = await db.getOrder(id);
            
            if (isMounted) {
                if (foundOrder) {
                    setOrder(foundOrder);
                } else {
                    setError('Order not found in database.');
                }
            }
        } catch (err) {
            console.error(err);
            if (isMounted) setError('Failed to load receipt.');
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    fetchOrder();

    return () => { isMounted = false; };
  }, [id, location.state]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
      <div className="min-h-screen bg-theme-black flex items-center justify-center">
          <div className="text-white font-bold text-xl animate-pulse">Generating Receipt...</div>
      </div>
  );

  if (error || !order) return (
      <div className="min-h-screen bg-theme-black flex flex-col items-center justify-center gap-4">
          <div className="text-red-500 font-bold text-xl">{error || 'Order Not Found'}</div>
          <Link to="/shop" className="text-theme-accent hover:text-white underline">Return to Shop</Link>
      </div>
  );

  return (
    <div className="min-h-screen bg-theme-black py-12 px-4 print:bg-white print:p-0">
      {/* Success Message Banner (Screen Only) */}
      <div className="max-w-3xl mx-auto mb-8 text-center print:hidden">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20 animate-bounce">
          <CheckCircle size={32} className="text-white" />
        </div>
        <h1 className="font-display font-black text-3xl text-white mb-2">Order Confirmed!</h1>
        <p className="text-gray-400 mb-6">Your gear is being prepared. Here is your receipt.</p>
        <div className="flex justify-center gap-4">
          <Link to="/shop" className="flex items-center gap-2 text-gray-400 hover:text-white transition font-bold">
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-theme-accent text-white px-6 py-2 rounded-lg font-bold hover:bg-theme-accent-hover transition shadow-neon"
          >
            <Printer size={18} /> Print Receipt
          </button>
        </div>
      </div>

      {/* Invoice Card - Styled as a Money Receipt */}
      <div className="max-w-[800px] mx-auto bg-white text-black p-10 shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:m-0 print:border-none relative">
        
        {/* Border Design */}
        <div className="border-4 border-double border-gray-800 p-8 h-full">
            
            {/* Header */}
            <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
                <h1 className="font-display font-black text-4xl italic tracking-wider uppercase mb-1">
                COMIC VERSE
                </h1>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-600 mb-2">Premium Hero Footwear</p>
                <p className="text-xs text-gray-500">123 Hero Avenue, Metropolis City, Comic World</p>
                <p className="text-xs text-gray-500">Phone: +880 1XXX-XXXXXX | Email: support@comicverse.com</p>
                
                <div className="mt-4 inline-block bg-black text-white px-6 py-1 font-bold uppercase tracking-widest text-sm rounded-sm">
                    Money Receipt
                </div>
            </div>

            {/* Info Grid */}
            <div className="flex justify-between items-start mb-8 text-sm">
                <div className="w-1/2">
                    <div className="flex mb-1">
                        <span className="w-24 font-bold text-gray-600">Invoice No:</span>
                        <span className="font-mono font-bold">#{order.id}</span>
                    </div>
                    <div className="flex mb-1">
                        <span className="w-24 font-bold text-gray-600">Date:</span>
                        <span>{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                     <div className="flex mb-1">
                        <span className="w-24 font-bold text-gray-600">Method:</span>
                        <span className="uppercase">{order.paymentMethod}</span>
                    </div>
                </div>
                <div className="w-1/2 text-right">
                    <div className="mb-1">
                        <span className="font-bold text-gray-600">Customer: </span>
                        <span className="font-bold uppercase">{order.shippingAddress.split(',')[0] || 'Valued Customer'}</span>
                    </div>
                    <div className="mb-1">
                        <span className="font-bold text-gray-600">Phone: </span>
                        <span>{order.contactNumber}</span>
                    </div>
                    <div className="text-xs text-gray-500 max-w-[200px] ml-auto">
                        {order.shippingAddress}
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8 border-collapse">
                <thead>
                    <tr className="bg-gray-100 border-y-2 border-gray-800">
                        <th className="text-left py-2 px-2 font-bold uppercase text-xs w-10">SL</th>
                        <th className="text-left py-2 px-2 font-bold uppercase text-xs">Description</th>
                        <th className="text-center py-2 px-2 font-bold uppercase text-xs w-16">Size</th>
                        <th className="text-center py-2 px-2 font-bold uppercase text-xs w-16">Qty</th>
                        <th className="text-right py-2 px-2 font-bold uppercase text-xs w-24">Rate</th>
                        <th className="text-right py-2 px-2 font-bold uppercase text-xs w-24">Total</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {order.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-300">
                        <td className="py-2 px-2 text-center text-gray-500">{idx + 1}</td>
                        <td className="py-2 px-2 font-bold">
                            {item.name}
                            <div className="text-xs text-gray-500 font-normal">{item.category}</div>
                        </td>
                        <td className="py-2 px-2 text-center">{item.selectedSize || '-'}</td>
                        <td className="py-2 px-2 text-center">{item.quantity}</td>
                        <td className="py-2 px-2 text-right">৳{item.price}</td>
                        <td className="py-2 px-2 text-right font-bold">৳{item.price * item.quantity}</td>
                    </tr>
                    ))}
                    {/* Fill empty rows to make it look like a full page if few items */}
                    {order.items.length < 5 && Array.from({ length: 5 - order.items.length }).map((_, i) => (
                         <tr key={`empty-${i}`} className="border-b border-gray-200 h-10">
                            <td colSpan={6}></td>
                         </tr>
                    ))}
                </tbody>
            </table>

            {/* Calculations */}
            <div className="flex justify-end mb-12">
                <div className="w-64">
                    <div className="flex justify-between py-1 px-2 border-b border-gray-200 text-sm">
                        <span className="font-bold text-gray-600">Sub Total</span>
                        <span className="font-bold">৳{order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
                    </div>
                    <div className="flex justify-between py-1 px-2 border-b border-gray-200 text-sm">
                        <span className="font-bold text-gray-600">Delivery Charge</span>
                        <span>৳{order.shippingCost}</span>
                    </div>
                    {order.discountAmount && order.discountAmount > 0 && (
                    <div className="flex justify-between py-1 px-2 border-b border-gray-200 text-sm text-red-600">
                        <span className="font-bold">Discount</span>
                        <span>- ৳{order.discountAmount}</span>
                    </div>
                    )}
                    <div className="flex justify-between py-2 px-2 bg-gray-100 border-t-2 border-gray-800 text-lg font-black mt-1">
                        <span>NET TOTAL</span>
                        <span>৳{order.totalAmount}</span>
                    </div>
                    
                    <div className="mt-2 text-right text-xs font-bold uppercase border px-2 py-1 inline-block float-right border-gray-400">
                        {order.paymentStatus === 'PAID' ? 'PAID IN FULL' : 'DUE / COD'}
                    </div>
                </div>
            </div>

            {/* Footer / Signatures */}
            <div className="flex justify-between items-end mt-16 pt-8">
                <div className="text-center">
                    <div className="border-t border-gray-400 w-32 mx-auto"></div>
                    <p className="text-xs font-bold text-gray-500 mt-1 uppercase">Customer Signature</p>
                </div>
                <div className="text-center">
                     <p className="font-display font-black text-xl italic text-gray-200 mb-2 select-none">COMIC VERSE</p>
                    <div className="border-t border-gray-400 w-32 mx-auto"></div>
                    <p className="text-xs font-bold text-gray-500 mt-1 uppercase">Authorized Signature</p>
                </div>
            </div>

            <div className="text-center mt-8 text-[10px] text-gray-400 uppercase tracking-widest">
                Thank you for being a hero!
            </div>
        </div>
      </div>
    </div>
  );
};