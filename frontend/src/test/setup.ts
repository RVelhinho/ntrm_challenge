import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './server';
import '../i18n/i18n';

Object.defineProperties(HTMLElement.prototype, {
  hasPointerCapture: { value: () => false },
  setPointerCapture: { value: () => undefined },
  releasePointerCapture: { value: () => undefined },
  scrollIntoView: { value: () => undefined },
});
window.scrollTo = () => undefined;

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
