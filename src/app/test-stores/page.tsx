import { TestStoresView } from '@/presentation/view/test-stores/TestStoresView';

export const metadata = {
  title: 'Store Audit | PaymentKita',
  description: 'Internal tool for auditing global state management and theme consistency.',
};

export default function TestStoresPage() {
  return <TestStoresView />;
}
