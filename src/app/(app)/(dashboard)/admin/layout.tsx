import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { UserRole } from '@/core/constants/roles';
import { ENV } from '@/core/config/env';

const BACKEND_URL = ENV.BACKEND_URL;
const INTERNAL_PROXY_SECRET = ENV.INTERNAL_PROXY_SECRET;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) {
    redirect('/login');
  }

  const response = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
    method: 'GET',
    headers: {
      'X-Session-Id': sessionId,
      ...(INTERNAL_PROXY_SECRET ? { 'X-Internal-Proxy-Secret': INTERNAL_PROXY_SECRET } : {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    redirect('/login');
  }

  const payload = await response.json();
  const role = payload?.data?.user?.role || payload?.user?.role || null;

  if (role !== UserRole.ADMIN) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
