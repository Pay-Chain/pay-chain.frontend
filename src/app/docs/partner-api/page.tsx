import { PartnerAPIView } from '@/presentation/view/docs/partner/PartnerAPIView';

export const metadata = {
  title: 'Partner API | PaymentKita Docs',
  description: 'Deep-dive documentation for PaymentKita institutional partners.',
};

export default function PartnerAPIPage() {
  return <PartnerAPIView />;
}
