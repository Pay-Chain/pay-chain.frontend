'use client';

import { useAdminUsersViewModel } from './useAdminUsersViewModel';
import { Card, Button } from '@/presentation/components/atoms';
import { Search, Loader2 } from 'lucide-react';

export const AdminUsersView = () => {
  const { 
    users, 
    isLoading, 
    searchTerm, 
    setSearchTerm, 
    isSearching 
  } = useAdminUsersViewModel();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-muted">Manage all registered users</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple w-64 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-muted">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-accent-purple" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-muted text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">KYC Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading && !users ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : users?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted">
                    No users found
                  </td>
                </tr>
              ) : (
                users?.map((user: any) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.kycStatus === 'fully_verified'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}
                      >
                        {user.kycStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
