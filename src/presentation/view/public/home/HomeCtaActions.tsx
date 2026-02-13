'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/presentation/components/atoms';
import { useHomeCta } from './useHomeCta';

interface HomeCtaActionsProps {
  primaryLabel: string;
  secondaryLabel: string;
}

export function HomeCtaActions({ primaryLabel, secondaryLabel }: HomeCtaActionsProps) {
  const { primaryHref } = useHomeCta();

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Link href={primaryHref}>
        <Button variant="primary" size="lg" glow>
          {primaryLabel}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </Link>
      <Link href="/contact">
        <Button variant="outline" size="lg">
          {secondaryLabel}
        </Button>
      </Link>
    </div>
  );
}
