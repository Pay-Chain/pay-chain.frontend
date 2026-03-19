import { DashboardLayoutView } from '@/presentation/view/layout/DashboardLayoutView';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutView>{children}</DashboardLayoutView>;
}
