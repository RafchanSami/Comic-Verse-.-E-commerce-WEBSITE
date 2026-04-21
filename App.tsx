import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { UpdatePassword } from './pages/UpdatePassword';
import { AdminDashboard } from './pages/AdminDashboard';
import { Contact } from './pages/Contact';
import { InvoicePage } from './pages/InvoicePage';
import { OrderTracking } from './pages/OrderTracking';
import { About } from './pages/About';
import { UserDashboard } from './pages/UserDashboard';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
          <HashRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/invoice/:id" element={<InvoicePage />} />
              <Route path="/admin" element={
                 <Layout>
                    <AdminDashboard />
                 </Layout>
              } />
              <Route path="/dashboard" element={
                 <Layout>
                    <UserDashboard />
                 </Layout>
              } />
              <Route path="*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/track-order" element={<OrderTracking />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;