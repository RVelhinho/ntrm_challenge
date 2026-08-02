import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { apiClient } from './client';
import { server } from '../test/server';

describe('apiClient', () => {
  it('throws a typed API error from a structured response', async () => {
    server.use(
      http.get('*/api/v1/test', () =>
        HttpResponse.json(
          { error: { code: 'invalid_request', message: 'Invalid request.' } },
          { status: 422 },
        ),
      ),
    );

    await expect(apiClient('/api/v1/test')).rejects.toMatchObject({
      status: 422,
      body: { error: { code: 'invalid_request', message: 'Invalid request.' } },
    });
  });
});
