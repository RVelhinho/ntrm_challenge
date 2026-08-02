import { Suspense } from 'react';
import { Outlet } from '@tanstack/react-router';
import { LoadingPage } from '../../pages/LoadingPage/LoadingPage';
import { Header } from './Header';

export function RootLayout() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        <Suspense fallback={<LoadingPage />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}
