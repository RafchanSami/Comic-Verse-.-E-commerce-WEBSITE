import { supabase } from './supabaseClient';
import { Product, User, UserRole, Order, OrderStatus, PaymentMethod, PaymentStatus, PromoCode, Notice, Category, EmailConfig, Review } from '../types';

class SupabaseService {
  
  // Helper to generate visual stats if missing in DB
  private injectStats(product: Product): Product {
    if (product.heroStats) return product;

    let hash = 0;
    for (let i = 0; i < product.id.length; i++) {
        hash = product.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const base = Math.abs(hash);

    return {
        ...product,
        heroStats: {
            speed: (base % 40) + 60,             
            durability: ((base >> 2) % 40) + 60, 
            stealth: ((base >> 4) % 40) + 60,    
            comfort: ((base >> 6) % 30) + 70     
        }
    };
  }

  // --- Products ---
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        if (!error.message.includes('aborted') && !error.message.includes('Failed to fetch')) {
          console.error("Error fetching products:", error.message);
        }
        return [];
      }
      return (data as Product[]).map(p => this.injectStats(p));
    } catch (e) {
      return [];
    }
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return this.injectStats(data as Product);
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const dbPayload = {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        stock: product.stock,
        sizes: product.sizes,
        featured: product.featured || false
    };

    const { data, error } = await supabase
      .from('products')
      .insert([dbPayload])
      .select()
      .single();
    
    if (error) throw error;
    return this.injectStats(data as Product);
  }

  async seedProducts(): Promise<void> {
    console.warn("Seeding functionality has been disabled.");
    return;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const dbPayload: any = {};
    if (data.name !== undefined) dbPayload.name = data.name;
    if (data.description !== undefined) dbPayload.description = data.description;
    if (data.price !== undefined) dbPayload.price = data.price;
    if (data.category !== undefined) dbPayload.category = data.category;
    if (data.image !== undefined) dbPayload.image = data.image;
    if (data.stock !== undefined) dbPayload.stock = data.stock;
    if (data.sizes !== undefined) dbPayload.sizes = data.sizes;
    if (data.featured !== undefined) dbPayload.featured = data.featured;

    const { data: updated, error } = await supabase
      .from('products')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.injectStats(updated as Product);
  }

  async deleteProduct(id: string): Promise<void> {
    // We strictly check count to ensure RLS didn't silently block the delete
    const { error, count } = await supabase
        .from('products')
        .delete({ count: 'exact' })
        .eq('id', id);

    if (error) {
        console.error("Delete DB Error:", error);
        throw new Error(error.message);
    }

    if (count === 0) {
        throw new Error("Product could not be deleted. Check if you have Admin permissions or if the product exists.");
    }
  }

  async updateStock(id: string, quantity: number) {
    const { data: product } = await supabase.from('products').select('stock').eq('id', id).single();
    if (product) {
        const newStock = Math.max(0, product.stock - quantity);
        await supabase.from('products').update({ stock: newStock }).eq('id', id);
    }
  }

  // --- Reviews ---
  async getReviews(productId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
        // If table doesn't exist yet, return empty to prevent crash
        if (error.code === '42P01') return [];
        return [];
    }

    return data.map((r: any) => ({
      id: r.id,
      productId: r.product_id,
      userId: r.user_id,
      userName: r.user_name,
      rating: r.rating,
      comment: r.comment,
      date: r.created_at
    }));
  }

  async addReview(review: Omit<Review, 'id' | 'date'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        product_id: review.productId,
        user_id: review.userId,
        user_name: review.userName,
        rating: review.rating,
        comment: review.comment
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      productId: data.product_id,
      userId: data.user_id,
      userName: data.user_name,
      rating: data.rating,
      comment: data.comment,
      date: data.created_at
    };
  }

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) return [];
    return data as Category[];
  }

  async createCategory(name: string): Promise<Category> {
    const { data, error } = await supabase.from('categories').insert([{ name }]).select().single();
    if (error) throw error;
    return data as Category;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  }

  // --- Orders ---
  async createOrder(orderData: Omit<Order, 'id' | 'status' | 'date' | 'paymentStatus'>): Promise<Order> {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    
    const dbPayload = {
        id: orderId,
        user_id: orderData.userId,
        items: orderData.items,
        total_amount: orderData.totalAmount,
        discount_amount: orderData.discountAmount,
        shipping_cost: orderData.shippingCost,
        promo_code: orderData.promoCode,
        status: OrderStatus.PENDING,
        shipping_address: orderData.shippingAddress,
        contact_number: orderData.contactNumber,
        payment_method: orderData.paymentMethod,
        payment_status: PaymentStatus.PENDING,
        transaction_id: orderData.transactionId,
        date: new Date().toISOString()
    };

    const { data, error } = await supabase.from('orders').insert([dbPayload]).select().single();
    
    if (error) throw error;

    for (const item of orderData.items) {
      await this.updateStock(item.id, item.quantity);
    }

    return this.mapOrderFromDB(data);
  }

  async getOrders(userId?: string): Promise<Order[]> {
    let query = supabase.from('orders').select('*').order('date', { ascending: false });
    
    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) return [];
    
    return data.map(this.mapOrderFromDB);
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (error) return undefined;
    return this.mapOrderFromDB(data);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    await supabase.from('orders').update({ status }).eq('id', orderId);
  }

  async updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<void> {
    const updateData: any = { payment_status: status };
    if (status === PaymentStatus.PAID) {
        const { data } = await supabase.from('orders').select('status').eq('id', orderId).single();
        if (data && data.status === OrderStatus.PENDING) {
            updateData.status = OrderStatus.CONFIRMED;
        }
    }
    await supabase.from('orders').update(updateData).eq('id', orderId);
  }

  // --- Auth & Users ---
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) return [];
    return data.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        role: (String(p.role || 'CUSTOMER').trim().toUpperCase() === 'ADMIN' ? UserRole.ADMIN : UserRole.CUSTOMER),
        isBlocked: p.is_blocked
    }));
  }

  async toggleUserBlock(userId: string): Promise<void> {
     const { data } = await supabase.from('profiles').select('is_blocked').eq('id', userId).single();
     if (data) {
         await supabase.from('profiles').update({ is_blocked: !data.is_blocked }).eq('id', userId);
     }
  }

  async login(email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    if (data.user) {
        const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        
        if (profile) {
             if (profile.is_blocked) {
                await supabase.auth.signOut();
                throw new Error("Account Blocked");
             }
             
             const rawRole = profile.role || 'CUSTOMER';
             const roleString = String(rawRole).trim().toUpperCase();
             const finalRole = roleString === 'ADMIN' ? UserRole.ADMIN : UserRole.CUSTOMER;

             return {
                 id: data.user.id,
                 email: data.user.email!,
                 name: profile.name,
                 role: finalRole,
                 isBlocked: profile.is_blocked
             };
        } else {
             // Fallback if profile row is missing
             return {
                 id: data.user.id,
                 email: data.user.email!,
                 name: data.user.user_metadata?.name || email.split('@')[0],
                 role: UserRole.CUSTOMER,
                 isBlocked: false
             };
        }
    }
    return null;
  }

  async register(name: string, email: string, password: string): Promise<User> {
    // 1. Sign up user in Auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name }
        }
    });

    if (error) throw error;
    if (!data.user) throw new Error("Registration failed");

    // 2. Explicitly insert into profiles (Fallback if SQL trigger is missing)
    const { error: profileError } = await supabase.from('profiles').insert([{
        id: data.user.id,
        email: email,
        name: name,
        role: 'CUSTOMER'
    }]);

    if (profileError) {
        // 23505 = unique_violation (Profile already created by trigger) - Ignore
        // Otherwise, log it but don't fail registration completely if Auth succeeded
        if (profileError.code !== '23505') {
            console.warn("Manual profile creation failed (Trigger might have handled it):", profileError.message);
        }
    }

    return {
        id: data.user.id,
        name: name,
        email: email,
        role: UserRole.CUSTOMER,
        isBlocked: false
    };
  }

  async resendConfirmationEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) throw error;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/#/update-password',
    });
    if (error) throw error;
  }

  async updateUserPassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }

  // --- Promo Codes ---
  async getPromos(): Promise<PromoCode[]> {
    const { data, error } = await supabase.from('promos').select('*');
    if (error) return [];
    return data.map(p => ({...p, isActive: p.is_active}));
  }

  async createPromo(promo: Omit<PromoCode, 'id'>): Promise<PromoCode> {
    const payload = { 
        code: promo.code, 
        type: promo.type, 
        value: promo.value, 
        is_active: promo.isActive 
    };
    const { data, error } = await supabase.from('promos').insert([payload]).select().single();
    if (error) throw error;
    return { ...data, isActive: data.is_active };
  }

  async deletePromo(id: string): Promise<void> {
    await supabase.from('promos').delete().eq('id', id);
  }

  async togglePromoStatus(id: string): Promise<void> {
    const { data } = await supabase.from('promos').select('is_active').eq('id', id).single();
    if (data) {
        await supabase.from('promos').update({ is_active: !data.is_active }).eq('id', id);
    }
  }

  async validatePromo(code: string): Promise<PromoCode | null> {
    const { data, error } = await supabase
        .from('promos')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();
    
    if (error || !data) return null;
    return { ...data, isActive: data.is_active };
  }

  // --- Notices ---
  async getNotices(): Promise<Notice[]> {
    const { data, error } = await supabase.from('notices').select('*');
    if (error) return [];
    return data.map(n => ({...n, isActive: n.is_active}));
  }

  async getActiveNotices(): Promise<Notice[]> {
    const { data, error } = await supabase.from('notices').select('*').eq('is_active', true);
    if (error) return [];
    return data.map(n => ({...n, isActive: n.is_active}));
  }

  async createNotice(notice: Omit<Notice, 'id'>): Promise<Notice> {
    const payload = { 
        message: notice.message, 
        type: notice.type, 
        is_active: notice.isActive 
    };
    const { data, error } = await supabase.from('notices').insert([payload]).select().single();
    if (error) throw error;
    return { ...data, isActive: data.is_active };
  }

  async deleteNotice(id: string): Promise<void> {
    await supabase.from('notices').delete().eq('id', id);
  }

  async toggleNoticeStatus(id: string): Promise<void> {
    const { data } = await supabase.from('notices').select('is_active').eq('id', id).single();
    if (data) {
        await supabase.from('notices').update({ is_active: !data.is_active }).eq('id', id);
    }
  }

  async saveEmailConfig(config: EmailConfig): Promise<void> {
      const { error } = await supabase
        .from('app_settings')
        .upsert({ id: 'email_config', value: config });
        
      if (error) {
          console.error("Failed to save email config", error);
          throw error;
      }
  }

  async getEmailConfig(): Promise<EmailConfig | null> {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('id', 'email_config')
        .single();
        
      return data ? data.value : null;
  }

  private mapOrderFromDB(data: any): Order {
      return {
          id: data.id,
          userId: data.user_id,
          items: data.items,
          totalAmount: data.total_amount,
          discountAmount: data.discount_amount,
          shippingCost: data.shipping_cost,
          promoCode: data.promo_code,
          status: data.status,
          shippingAddress: data.shipping_address,
          contactNumber: data.contact_number,
          paymentMethod: data.payment_method,
          paymentStatus: data.payment_status,
          transactionId: data.transaction_id,
          date: data.date
      };
  }
}

export const db = new SupabaseService();