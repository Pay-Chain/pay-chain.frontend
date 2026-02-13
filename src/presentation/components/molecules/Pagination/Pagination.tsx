import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/presentation/components/atoms';
import { useTranslation } from '@/presentation/hooks';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading
}) => {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t border-border/10">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          variant="secondary"
          size="sm"
        >
          {t('common.previous')}
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          variant="secondary"
          size="sm"
        >
          {t('common.next')}
        </Button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label={t('common.pagination')}>
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            variant="ghost"
            className="rounded-l-md px-2"
          >
            <span className="sr-only">{t('common.previous')}</span>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          {getPages().map((page, idx) => (
            <React.Fragment key={idx}>
              {page === '...' ? (
                <span className="relative inline-flex items-center px-4 py-2 border border-border/10 bg-background text-sm font-medium text-muted">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <Button
                  onClick={() => onPageChange(page as number)}
                  variant={currentPage === page ? 'primary' : 'ghost'}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium`}
                  disabled={isLoading}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}

          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            variant="ghost"
            className="rounded-r-md px-2"
          >
            <span className="sr-only">{t('common.next')}</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </div>
  );
};
