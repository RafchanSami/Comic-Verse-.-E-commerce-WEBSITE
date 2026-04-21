import React from 'react';
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '../../types';
import { db } from '../../services/mockDb';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  orders: Order[];
  onUpdate: () => void;
}

const StatusBadge = ({ status, type }: { status: string, type?: 'PAYMENT' | 'ORDER' }) => {
  let style = 'bg-gray-500/10 text-gray-500 border-gray-500/30';

  const styles: any = {
    [OrderStatus.CONFIRMED]: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    [OrderStatus.SHIPPED]: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
    [OrderStatus.DELIVERED]: 'bg-green-500/10 text-green-500 border-green-500/30',
    [OrderStatus.CANCELLED]: 'bg-red-500/10 text-red-500 border-red-500/30',
    [PaymentStatus.PAID]: 'bg-green-500/10 text-green-500 border-green-500/30',
    [PaymentStatus.FAILED]: 'bg-red-500/10 text-red-500 border-red-500/30',
  };

  if (status === 'PENDING') {
    if (type === 'PAYMENT') {
       style = 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    } else {
       style = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
    }
  } else if (styles[status]) {
    style = styles[status];
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${style}`}>
      {status}
    </span>
  );
};

export const AdminOrders = ({ orders, onUpdate }: Props) => {
  
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await db.updateOrderStatus(orderId, newStatus);
    onUpdate();
  };

  const handlePaymentVerify = async (orderId: string, status: PaymentStatus) => {
    if (window.confirm(`Mark payment as ${status}?`)) {
      await db.updatePaymentStatus(orderId, status);
      onUpdate();
    }
  };

  return (
    <div className="bg-theme-dark/50 backdrop-blur-md rounded-2xl border border-gray-800 shadow-3d overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <h2 className="font-display font-bold text-xl text-white">Order Management</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Order Details</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-800/30 transition">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    {order.id}
                    <Link to={`/invoice/${order.id}`} className="text-theme-accent hover:text-white" title="View Money Receipt">
                      <FileText size={14} />
                    </Link>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">{new Date(order.date).toLocaleDateString()}</div>
                  <div className="flex flex-col gap-1">
                    {order.items.map(item => (
                      <span key={item.id} className="text-xs text-gray-400">
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-white">{order.contactNumber}</div>
                  <div className="text-xs text-gray-500 max-w-[150px] truncate" title={order.shippingAddress}>{order.shippingAddress}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-white mb-1">৳{order.totalAmount}</div>
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-xs bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">{order.paymentMethod}</span>
                    <StatusBadge status={order.paymentStatus} type="PAYMENT" />
                    {order.paymentMethod === PaymentMethod.BKASH && order.transactionId && (
                      <div className="text-xs font-mono bg-gray-900 px-1 rounded text-pink-500 border border-pink-900/30">
                        TRX: {order.transactionId}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                   <StatusBadge status={order.status} type="ORDER" />
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-col gap-2">
                    <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="bg-theme-black border border-gray-700 text-gray-300 rounded text-xs p-1 focus:outline-none focus:border-theme-accent"
                      >
                         {Object.values(OrderStatus).map(s => (
                           <option key={s} value={s}>{s}</option>
                         ))}
                    </select>

                    {order.paymentMethod === PaymentMethod.BKASH && order.paymentStatus === PaymentStatus.PENDING && (
                      <div className="flex gap-2 mt-1">
                        <button 
                          onClick={() => handlePaymentVerify(order.id, PaymentStatus.PAID)}
                          className="p-1 bg-green-500/20 text-green-500 rounded hover:bg-green-500/40"
                          title="Approve Payment"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button 
                          onClick={() => handlePaymentVerify(order.id, PaymentStatus.FAILED)}
                          className="p-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500/40"
                          title="Reject Payment"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};