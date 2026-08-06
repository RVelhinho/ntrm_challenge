import { useState, type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { createQueryClient, queryClient } from './query-client';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../i18n/i18n';
import { LanguageProvider } from './providers/LanguageProvider';

export function AppProviders({ children }: PropsWithChildren) {
  const [client] = useState(() =>
    import.meta.env.MODE === 'test' ? createQueryClient() : queryClient,
  );
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <QueryClientProvider client={client}>
          {children}
          <Toaster position="top-right" />
        </QueryClientProvider>
      </LanguageProvider>
    </I18nextProvider>
  );
}
