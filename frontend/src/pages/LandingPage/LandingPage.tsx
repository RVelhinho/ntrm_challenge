import { Button } from '../../shared/ui/Button/Button';
import { Text } from '../../shared/ui/Text/Text';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';

export function LandingPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid w-full gap-8 rounded-panel border-border bg-surface p-5 shadow-panel md:grid-cols-[1.2fr_0.8fr] md:p-8">
        <div>
          <p className="text-xs font-medium text-brand-600">{t('landing.eyebrow')}</p>
          <h1 className="mt-2 text-xl font-medium tracking-tight text-text-strong sm:text-2xl">
            {t('landing.title')}
          </h1>
          <Text tone="muted" className="mt-3 max-w-xl">
            {t('landing.description')}
          </Text>
        </div>
        <div className="flex flex-col justify-center gap-4">
          <Link to="/nutritionists">
            <Button className="w-full">{t('landing.findNutritionist')}</Button>
          </Link>
          <Link to="/appointments">
            <Button variant="secondary" className="w-full">
              {t('landing.pendingRequests')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
