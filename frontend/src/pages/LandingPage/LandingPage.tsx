import { Button } from '../../components/shared/ui/Button/Button';
import { Text } from '../../components/shared/ui/Text/Text';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { PageContainer } from '../../app/layout/RootLayout';

export function LandingPage() {
  const { t } = useTranslation();
  return (
    <PageContainer className="flex flex-1 items-center py-10">
      <section className="grid w-full gap-8 rounded-panel border-border bg-surface p-5 shadow-panel md:grid-cols-[1.2fr_0.8fr] md:p-8">
        <div>
          <p className="text-xs font-medium text-primary-text">{t('landing.eyebrow')}</p>
          <h1 className="mt-2 text-xl font-medium tracking-tight text-text-strong sm:text-2xl">
            {t('landing.title')}
          </h1>
          <Text tone="muted" className="mt-3 max-w-xl">
            {t('landing.description')}
          </Text>
        </div>
        <div className="flex flex-col justify-center gap-4">
          <Button asChild className="w-full">
            <Link to="/nutritionists">{t('landing.findNutritionist')}</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link to="/appointments">{t('landing.pendingRequests')}</Link>
          </Button>
        </div>
      </section>
    </PageContainer>
  );
}
