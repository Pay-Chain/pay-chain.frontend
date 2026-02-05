'use client';

import { useState } from 'react';
import Sidebar from '@/presentation/components/organisms/Sidebar';
import BottomBar from '@/presentation/components/organisms/BottomBar';
import MobileDrawer from '@/presentation/components/organisms/MobileDrawer';
import DashboardToolbar from '@/presentation/components/organisms/DashboardToolbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Sidebar (Desktop) - Floating with 8px margin + 260px width */}
      <Sidebar />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main Content - lg:ml-[272px] = 8px margin + 260px sidebar + 4px gap */}
      <main className="lg:ml-[272px] min-h-screen pb-20 lg:pb-0">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-4 lg:px-15 xl:px-4 2xl:px-4 py-2 lg:py-3">
          {/* Dashboard Toolbar */}
          <DashboardToolbar onMenuClick={() => setDrawerOpen(true)} />

          {/* Page Content */}
          <div className='mt-25 min-h-screen'>
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Bar (Mobile) */}
      <BottomBar onMoreClick={() => setDrawerOpen(true)} />
    </div>
  );
}
