import { useTranslation } from 'react-i18next';
import { Text } from '../../components/shared/ui/Text/Text';
import { PageContainer } from '../../app/layout/RootLayout';

export function LoadingPage() {
  const { t } = useTranslation();

  return (
    <PageContainer className="py-6" role="status">
      <div className="animate-pulse rounded-panel border border-border bg-surface p-5 shadow-panel">
        <div className="h-4 w-32 rounded-control bg-border" />
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-40 rounded-card bg-surface-subtle" />
          ))}
        </div>
      </div>
      <Text className="sr-only">{t('common.loading')}</Text>
    </PageContainer>
  );
}
