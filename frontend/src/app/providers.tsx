import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './query-client';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../i18n/i18n';
import { LanguageProvider } from './providers/LanguageProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" />
        </QueryClientProvider>
      </LanguageProvider>
    </I18nextProvider>
  );
}
