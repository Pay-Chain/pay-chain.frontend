import { APIView } from '@/presentation/view/docs/api/APIView';

export const metadata = {
  title: 'API Reference | PaymentKita Docs',
  description: 'Complete API reference for PaymentKita integration.',
};

export default function APIReferencePage() {
  return <APIView />;
}
