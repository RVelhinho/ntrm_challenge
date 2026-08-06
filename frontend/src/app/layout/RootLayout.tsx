import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { Outlet } from '@tanstack/react-router';
import { LoadingPage } from '../../pages/LoadingPage/LoadingPage';
import { cn } from '../../shared/utils/class-names';
import { Header } from './Header';

export function PageContainer({
  as: Component = 'div',
  children,
  className,
  role,
}: {
  as?: 'div' | 'section';
  children: ReactNode;
  className?: string;
  role?: 'status';
}) {
  return (
    <Component
      className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}
      role={role}
    >
      {children}
    </Component>
  );
}

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
