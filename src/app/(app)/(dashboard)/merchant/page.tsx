import { MerchantDashboardView } from '@/presentation/view/merchant/MerchantDashboardView';

export const metadata = {
  title: 'Merchant Dashboard | PaymentKita',
  description: 'Manage your merchant account, view transactions, and configure payment settings.',
};

export default function MerchantPage() {
  return <MerchantDashboardView />;
}
