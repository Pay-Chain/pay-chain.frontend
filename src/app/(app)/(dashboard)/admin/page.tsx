import { AdminDashboardView } from '@/presentation/view/admin/AdminDashboardView';

export const metadata = {
  title: 'Admin Dashboard | PaymentKita',
  description: 'Global administrative overview and institutional metrics.',
};

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}
