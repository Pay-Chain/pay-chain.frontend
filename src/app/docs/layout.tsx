import { DocsLayoutView } from '@/presentation/view/layout/DocsLayoutView';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DocsLayoutView>{children}</DocsLayoutView>;
}
