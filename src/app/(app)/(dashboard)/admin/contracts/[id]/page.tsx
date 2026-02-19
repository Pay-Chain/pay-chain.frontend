'use client';

import { useParams } from 'next/navigation';
import { AdminContractDetailView } from '@/presentation/view/admin/contracts/detail/AdminContractDetailView';

export default function AdminContractDetailPage() {
  const params = useParams<{ id: string }>();
  const id = String(params?.id || '');
  return <AdminContractDetailView id={id} />;
}

