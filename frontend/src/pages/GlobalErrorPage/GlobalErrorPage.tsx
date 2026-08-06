import type { ErrorComponentProps } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/shared/ui/Button/Button';
import { Text } from '../../components/shared/ui/Text/Text';

export function GlobalErrorPage({ reset }: ErrorComponentProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-dvh flex-col bg-page">
      <main className="flex flex-1">
        <div className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-16 sm:px-6">
          <section className="w-full rounded-panel border border-danger-text/20 bg-surface p-6 text-center shadow-panel md:p-8">
            <h1 className="text-xl font-medium tracking-tight text-text-strong">
              {t('error.title')}
            </h1>
            <Text tone="muted" className="mx-auto mt-3 max-w-lg">
              {t('error.description')}
            </Text>
            <Button className="mt-6" onClick={reset}>
              {t('error.tryAgain')}
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
