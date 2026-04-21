import React from 'react';
import { Order, Product, User, OrderStatus } from '../../types';
import { DollarSign, ShoppingBag, Users, AlertTriangle } from 'lucide-react';

interface Props {
  orders: Order[];
  products: Product[];
  users: User[];
}

export const AdminStats = ({ orders, products, users }: Props) => {
  const revenue = orders
    .filter(o => o.status !== OrderStatus.CANCELLED)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;
  const lowStockProducts = products.filter(p => p.stock < 5).length;
  const activeUsers = users.filter(u => !u.isBlocked).length;

  const cards = [
    {
      title: 'Total Revenue',
      value: `৳${revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      subValue: `${pendingOrders} Pending`,
      icon: ShoppingBag,
      color: 'yellow',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Total Users',
      value: users.length.toString(),
      subValue: `${activeUsers} Active`,
      icon: Users,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockProducts.toString(),
      icon: AlertTriangle,
      color: 'red',
      gradient: 'from-red-500 to-rose-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-theme-dark/50 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-3d relative overflow-hidden group">
          <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
            <card.icon size={64} className={`text-${card.color}-500`} />
          </div>
          <div className="relative z-10">
            <h3 className="text-gray-400 font-bold text-sm uppercase mb-2">{card.title}</h3>
            <p className="text-3xl font-display font-black text-white mb-1">{card.value}</p>
            {card.subValue && <p className="text-xs text-theme-accent font-bold">{card.subValue}</p>}
          </div>
          <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${card.gradient}`}></div>
        </div>
      ))}
    </div>
  );
};