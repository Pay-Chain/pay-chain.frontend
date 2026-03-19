import { AdminContractDetailView } from '@/presentation/view/admin/contracts/detail/AdminContractDetailView';

// Next.js 15+ Page props
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminContractDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = String(resolvedParams?.id || '');
  
  return <AdminContractDetailView id={id} />;
}
