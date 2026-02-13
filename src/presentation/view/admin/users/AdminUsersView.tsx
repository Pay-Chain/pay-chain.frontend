'use client';

import { useAdminUsers } from './useAdminUsers';
import { Card, Button } from '@/presentation/components/atoms';
import { useTranslation } from '@/presentation/hooks';
import { Search, Loader2, LayoutGrid } from 'lucide-react';

export const AdminUsersView = () => {
  const { t } = useTranslation();
  const { state, actions } = useAdminUsers();
  const { 
    users, 
    isLoading, 
    searchTerm, 
    isSearching 
  } = state;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('admin.users_view.title')}</h1>
          <p className="text-muted">{t('admin.users_view.subtitle')}</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder={t('admin.users_view.search_placeholder')}
            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => actions.setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-muted">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 overflow-hidden rounded-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-muted text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">{t('admin.users_view.table.user')}</th>
                <th className="px-6 py-4">{t('admin.users_view.table.role')}</th>
                <th className="px-6 py-4">{t('admin.users_view.table.kyc_status')}</th>
                <th className="px-6 py-4">{t('admin.users_view.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading && !users ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted text-sm">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    {t('admin.users_view.loading')}
                  </td>
                </tr>
              ) : (!users || users.length === 0) ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted">
                    <div className="flex flex-col items-center gap-2">
                       <LayoutGrid className="w-8 h-8 opacity-20" />
                       <span className="text-sm">{t('admin.users_view.empty')}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-muted font-mono">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          user.kycStatus === 'fully_verified'
                            ? 'bg-accent-green/10 text-accent-green border-accent-green/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}
                      >
                        {user.kycStatus?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" className="hover:bg-white/10 rounded-lg h-8 px-3 text-xs">
                        {t('admin.users_view.view_details')}
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
