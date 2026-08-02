import { useTranslation } from 'react-i18next';
import { Text } from '../../shared/ui/Text/Text';

export function LoadingPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8" role="status">
      <div className="animate-pulse rounded-panel border border-border bg-surface p-5 shadow-panel">
        <div className="h-4 w-32 rounded-control bg-border" />
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-40 rounded-card bg-surface-subtle" />
          ))}
        </div>
      </div>
      <Text className="sr-only">{t('common.loading')}</Text>
    </div>
  );
}
