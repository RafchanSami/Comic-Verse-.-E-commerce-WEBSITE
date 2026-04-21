import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, ArrowLeft, Star, MessageSquare, User, Send } from 'lucide-react';
import { Product, Review } from '../types';
import { db } from '../services/mockDb';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const p = await db.getProduct(id);
        setProduct(p || null);
        if (p?.sizes && p.sizes.length > 0) {
          setSelectedSize(p.sizes[0]);
        }
        
        const r = await db.getReviews(id);
        setReviews(r);
        
        setLoading(false);
      };
      fetchData();
    }
  }, [id]);

  if (loading) return <div className="min-h-screen bg-theme-black flex items-center justify-center font-bold text-2xl text-white">Loading...</div>;
  if (!product) return <div className="min-h-screen bg-theme-black flex items-center justify-center font-bold text-xl text-white">Product not found.</div>;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`Added ${quantity} ${product.name} (Size: ${selectedSize}) to cart!`);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    setSubmittingReview(true);
    try {
      const review = await db.addReview({
        productId: id,
        userId: user.id,
        userName: user.name,
        rating: newRating,
        comment: newComment
      });
      setReviews([review, ...reviews]);
      setNewComment('');
      setNewRating(5);
    } catch (error) {
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 'New';

  return (
    <div className="min-h-screen bg-theme-black py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white font-bold mb-6 transition">
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        
        <div className="bg-theme-dark/50 backdrop-blur-md rounded-3xl border border-gray-800 shadow-3d grid grid-cols-1 md:grid-cols-2 overflow-hidden mb-12">
          {/* Image */}
          <div className="bg-gradient-to-br from-gray-900 to-black p-12 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-theme-accent/5"></div>
            <div className="absolute w-64 h-64 bg-theme-accent/20 blur-3xl rounded-full"></div>
            <img src={product.image} alt={product.name} className="w-full max-w-md object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)] z-10 hover:scale-105 transition duration-700" />
          </div>

          {/* Details */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-4">
              <span className="bg-theme-black px-4 py-1.5 rounded-full font-bold text-xs border border-gray-700 text-theme-accent uppercase tracking-wider shadow-inner-3d">{product.category}</span>
              {product.stock < 5 && product.stock > 0 && (
                <span className="ml-3 text-red-500 font-bold text-xs animate-pulse">Only {product.stock} left!</span>
              )}
            </div>
            
            <h1 className="font-display font-black text-4xl md:text-5xl mb-6 leading-none text-white italic">{product.name}</h1>
            
            {/* Origin Story Panel */}
            <div className="bg-theme-black border-2 border-gray-700 p-6 rounded-xl mb-8 relative group hover:border-theme-accent transition">
              <div className="absolute -top-3 left-4 bg-theme-black px-2 font-display font-bold text-gray-500 text-xs uppercase tracking-widest group-hover:text-theme-accent transition">
                Origin Story / Description
              </div>
              <p className="text-gray-300 font-medium leading-relaxed italic">
                "{product.description}"
              </p>
            </div>

            <div className="flex items-center justify-between mb-8">
              <span className="font-display font-bold text-5xl text-white">৳{product.price}</span>
              <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-lg border border-yellow-500/30">
                 <Star className="fill-yellow-500 text-yellow-500" size={20} />
                 <span className="font-bold text-yellow-500 text-xl">{averageRating}</span>
                 <span className="text-gray-500 text-xs uppercase font-bold">({reviews.length} Reviews)</span>
              </div>
            </div>

            {product.stock > 0 ? (
              <div className="space-y-8">
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <span className="font-bold text-gray-300 block mb-3">Select Size:</span>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 rounded-lg font-bold border transition ${
                            selectedSize === size 
                              ? 'bg-theme-accent border-theme-accent text-white shadow-neon' 
                              : 'bg-theme-black border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <span className="font-bold mr-6 text-gray-300">Quantity:</span>
                  <div className="flex items-center bg-theme-black rounded-xl border border-gray-700 p-1 shadow-inner-3d">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-800 rounded-lg text-white transition"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-6 font-bold text-white text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 hover:bg-gray-800 rounded-lg text-white transition"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-theme-accent text-white py-5 rounded-xl font-bold text-xl shadow-neon hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:bg-theme-accent-hover transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1"
                >
                  <ShoppingCart size={24} /> ADD TO CART
                </button>
              </div>
            ) : (
              <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/30 text-center font-bold text-red-500">
                OUT OF STOCK
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Reviews List */}
           <div className="lg:col-span-2">
              <h2 className="font-display font-black text-3xl text-white italic mb-6 flex items-center gap-3">
                 <MessageSquare className="text-theme-accent" /> FIELD REPORTS
              </h2>
              
              {reviews.length === 0 ? (
                 <div className="bg-theme-dark/30 rounded-2xl p-8 border border-gray-800 text-center">
                    <p className="text-gray-500 font-bold mb-2">No intel gathered yet.</p>
                    <p className="text-sm text-gray-600">Be the first to report on this gear.</p>
                 </div>
              ) : (
                 <div className="space-y-4">
                    {reviews.map(review => (
                       <div key={review.id} className="bg-theme-dark/50 p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition">
                          <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-black rounded-full flex items-center justify-center border border-gray-600">
                                   <User size={20} className="text-gray-400" />
                                </div>
                                <div>
                                   <h4 className="font-bold text-white text-sm">{review.userName}</h4>
                                   <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                                </div>
                             </div>
                             <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                   <Star key={i} size={14} className={i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-700"} />
                                ))}
                             </div>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">
                             {review.comment}
                          </p>
                       </div>
                    ))}
                 </div>
              )}
           </div>

           {/* Add Review Form */}
           <div>
              <div className="bg-theme-dark p-6 rounded-2xl border border-gray-800 sticky top-24">
                 <h3 className="font-bold text-xl text-white mb-4">Write a Report</h3>
                 
                 {isAuthenticated ? (
                    <form onSubmit={handleSubmitReview}>
                       <div className="mb-4">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rating</label>
                          <div className="flex gap-2">
                             {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setNewRating(star)}
                                  className="focus:outline-none transition transform hover:scale-110"
                                >
                                   <Star 
                                     size={24} 
                                     className={star <= newRating ? "fill-yellow-500 text-yellow-500" : "text-gray-600"} 
                                   />
                                </button>
                             ))}
                          </div>
                       </div>
                       
                       <div className="mb-4">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Observation</label>
                          <textarea 
                             required
                             rows={4}
                             value={newComment}
                             onChange={(e) => setNewComment(e.target.value)}
                             className="w-full bg-theme-black border border-gray-700 rounded-xl p-3 text-white focus:border-theme-accent focus:outline-none text-sm resize-none"
                             placeholder="Share your experience with this gear..."
                          ></textarea>
                       </div>

                       <button 
                         type="submit" 
                         disabled={submittingReview}
                         className="w-full bg-theme-accent text-white font-bold py-3 rounded-xl shadow-neon hover:bg-theme-accent-hover transition flex items-center justify-center gap-2 disabled:opacity-50"
                       >
                          {submittingReview ? 'Submitting...' : <><Send size={16} /> Submit Report</>}
                       </button>
                    </form>
                 ) : (
                    <div className="text-center py-6">
                       <p className="text-gray-400 text-sm mb-4">You must be logged in to submit a field report.</p>
                       <Link to="/login" className="inline-block px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold text-sm transition">
                          Login Now
                       </Link>
                    </div>
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};