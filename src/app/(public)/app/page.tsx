import AppView from '@/presentation/view/app/AppView';
import Navbar from '@/presentation/components/organisms/Navbar';

export default function PaymentAppPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-10 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <AppView />
      </div>

    </div>
  );
}
