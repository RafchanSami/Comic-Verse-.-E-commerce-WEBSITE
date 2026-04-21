import React from 'react';
import { User, UserRole } from '../../types';
import { db } from '../../services/mockDb';
import { Shield, ShieldOff, Ban, CheckCircle } from 'lucide-react';

interface Props {
  users: User[];
  onUpdate: () => void;
}

export const AdminUsers = ({ users, onUpdate }: Props) => {
  const toggleBlock = async (userId: string) => {
    if (window.confirm('Are you sure you want to change this user\'s access status?')) {
      await db.toggleUserBlock(userId);
      onUpdate();
    }
  };

  return (
    <div className="bg-theme-dark/50 backdrop-blur-md rounded-2xl border border-gray-800 shadow-3d overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <h2 className="font-display font-bold text-xl text-white">User Management</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">User Info</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-800/30 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold border border-gray-600">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-white">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.role === UserRole.ADMIN ? 'bg-theme-accent/20 text-theme-accent' : 'bg-gray-700 text-gray-300'}`}>
                      {user.role === UserRole.ADMIN ? <Shield size={12} className="mr-1" /> : <ShieldOff size={12} className="mr-1" />}
                      {user.role}
                   </span>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.isBlocked ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {user.role !== UserRole.ADMIN && (
                    <button 
                      onClick={() => toggleBlock(user.id)}
                      className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1 ml-auto ${user.isBlocked ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
                    >
                      {user.isBlocked ? <><CheckCircle size={12}/> Unblock</> : <><Ban size={12}/> Block</>}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};