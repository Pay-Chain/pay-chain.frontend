'use client';

import { useState } from 'react';
import Sidebar from '@/presentation/components/organisms/Sidebar';
import BottomBar from '@/presentation/components/organisms/BottomBar';
import MobileDrawer from '@/presentation/components/organisms/MobileDrawer';
import DashboardToolbar from '@/presentation/components/organisms/DashboardToolbar';

export function DashboardLayoutView({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-pk-bg text-white animate-fade-in">
      {/* Sidebar (Desktop) - Floating with 8px margin + 260px width */}
      <Sidebar />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main Content - lg:ml-[272px] = 8px margin + 260px sidebar + 4px gap */}
      <main className="lg:ml-[272px] min-h-screen pb-20 lg:pb-0 transition-all duration-500">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 lg:py-6">
          {/* Dashboard Toolbar */}
          <DashboardToolbar onMenuClick={() => setDrawerOpen(true)} />

          {/* Page Content */}
          <div className='mt-24 min-h-[calc(100vh-160px)]'>
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Bar (Mobile) */}
      <BottomBar onMoreClick={() => setDrawerOpen(true)} />
    </div>
  );
}
