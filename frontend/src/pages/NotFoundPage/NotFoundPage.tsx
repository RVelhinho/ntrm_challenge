import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/shared/ui/Button/Button';
import { Text } from '../../components/shared/ui/Text/Text';
import { PageContainer } from '../../app/layout/RootLayout';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <PageContainer className="flex max-w-5xl flex-1 items-center py-16">
      <section className="w-full rounded-panel border-border bg-surface p-6 text-center shadow-panel md:p-8">
        <p className="text-xs font-medium text-primary-text">{t('notFound.code')}</p>
        <h1 className="mt-2 text-xl font-medium tracking-tight text-text-strong">
          {t('notFound.title')}
        </h1>
        <Text tone="muted" className="mx-auto mt-3 max-w-lg">
          {t('notFound.description')}
        </Text>
        <Button asChild className="mt-6">
          <Link to="/">{t('notFound.backHome')}</Link>
        </Button>
      </section>
    </PageContainer>
  );
}
