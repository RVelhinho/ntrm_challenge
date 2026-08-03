import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared/ui/Button/Button';
import { Text } from '../../shared/ui/Text/Text';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-16 sm:px-6">
      <section className="w-full rounded-panel border-border bg-surface p-6 text-center shadow-panel md:p-8">
        <p className="text-xs font-medium text-primary-text">{t('notFound.code')}</p>
        <h1 className="mt-2 text-xl font-medium tracking-tight text-text-strong">
          {t('notFound.title')}
        </h1>
        <Text tone="muted" className="mx-auto mt-3 max-w-lg">
          {t('notFound.description')}
        </Text>
        <Link to="/" className="mt-6 inline-block">
          <Button>{t('notFound.backHome')}</Button>
        </Link>
      </section>
    </div>
  );
}
