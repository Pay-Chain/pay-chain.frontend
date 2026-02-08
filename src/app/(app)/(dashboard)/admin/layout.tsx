import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { validateSession, isAuthorized } from '@/core/auth/auth_guard';
import { UserRole } from '@/core/constants/roles';
import { decryptToken } from '@/core/security/token';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const encryptedToken = cookieStore.get('token')?.value;

  if (!encryptedToken) {
    redirect('/login');
  }

  const token = await decryptToken(encryptedToken);
  if (!token) {
    redirect('/login');
  }

  const session = await validateSession(token);
  console.log(`[AdminLayout] Session: ${JSON.stringify(session)}`);
  
  if (!session || !isAuthorized(session.role, UserRole.ADMIN)) {
    console.log(`[AdminLayout] Access denied. Role: ${session?.role}`);
    redirect('/dashboard'); // or 403 page
  }

  return (
    <>
      {children}
    </>
  );
}
