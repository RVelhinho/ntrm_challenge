import { createRootRoute } from '@tanstack/react-router';
import { GlobalErrorPage } from '../../pages/GlobalErrorPage/GlobalErrorPage';
import { LoadingPage } from '../../pages/LoadingPage/LoadingPage';
import { NotFoundPage } from '../../pages/NotFoundPage/NotFoundPage';
import { RootLayout } from '../layout/RootLayout';

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: GlobalErrorPage,
  notFoundComponent: NotFoundPage,
  pendingComponent: LoadingPage,
});
