import { useTranslation } from 'react-i18next';
import { cn } from '../../../../shared/utils/class-names';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';

type PaginationProps = {
  label: string;
  currentPage: number;
  pages?: number[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({
  label,
  currentPage,
  pages = [],
  hasPreviousPage,
  hasNextPage,
  onPageChange,
  className,
}: PaginationProps) {
  const { t } = useTranslation();

  return (
    <nav aria-label={label} className={cn('inline-flex', className)}>
      <Button
        size="sm"
        variant="secondary"
        className="h-8 w-8 rounded-none rounded-l-sm border-none p-0 shadow-none"
        aria-label={t('common.previous')}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
      >
        <Icon name="chevron-left" width={13} height={13} strokeWidth={1.75} />
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          size="sm"
          variant={page === currentPage ? 'soft' : 'secondary'}
          className="h-8 w-8 rounded-none border-none p-0 text-xs shadow-none"
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        size="sm"
        variant="secondary"
        className="h-8 w-8 rounded-none rounded-r-sm border-none p-0 shadow-none"
        aria-label={t('common.next')}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        <Icon name="chevron-right" width={13} height={13} strokeWidth={1.75} />
      </Button>
    </nav>
  );
}
