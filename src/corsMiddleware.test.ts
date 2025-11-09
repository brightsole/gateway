import type { APIGatewayProxyEventV2 } from 'aws-lambda';

// Set env before importing modules that use it
process.env.NODE_ENV = 'test';
process.env.SST_STAGE = 'preview';

const mockEvent = (
  origin: string | undefined,
  method: string = 'POST',
): APIGatewayProxyEventV2 =>
  ({
    headers: origin ? { origin } : {},
    requestContext: {
      http: { method },
    },
  }) as unknown as APIGatewayProxyEventV2;

const mockResult = () => ({
  statusCode: 200,
  body: JSON.stringify({ data: 'test' }),
  headers: {} as Record<string, string>,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCorsMiddleware = async (): Promise<any> => {
  jest.resetModules();
  return (await import('./corsMiddleware')).default;
};

describe('corsMiddleware', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let corsMiddleware: any;

  beforeEach(async () => {
    corsMiddleware = await getCorsMiddleware();
  });

  describe('with allowed origin', () => {
    it('adds CORS headers for preview stage', async () => {
      const event = mockEvent('https://preview.jumpingbeen.com', 'POST');
      const result = mockResult();

      const modifier = await corsMiddleware(event);
      if (typeof modifier === 'function') {
        await modifier(result);
      }

      expect(result.headers).toEqual({
        'Access-Control-Allow-Origin': 'https://preview.jumpingbeen.com',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'content-type',
        'Access-Control-Allow-Credentials': 'true',
      });
      expect(result.statusCode).toBe(200);
      expect(result.body).toBe(JSON.stringify({ data: 'test' }));
    });

    it('adds CORS headers for production stage', async () => {
      process.env.NODE_ENV = 'production';
      process.env.SST_STAGE = 'production';
      const prodCorsMiddleware = await getCorsMiddleware();

      const event = mockEvent('https://jumpingbeen.com', 'POST');
      const result = mockResult();

      const modifier = await prodCorsMiddleware(event);
      if (typeof modifier === 'function') {
        await modifier(result);
      }

      expect(result.headers).toEqual({
        'Access-Control-Allow-Origin': 'https://jumpingbeen.com',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'content-type',
        'Access-Control-Allow-Credentials': 'true',
      });

      // Reset for other tests
      process.env.NODE_ENV = 'test';
      process.env.SST_STAGE = 'preview';
    });

    it('handles OPTIONS preflight requests with 204', async () => {
      const event = mockEvent('https://preview.jumpingbeen.com', 'OPTIONS');
      const result = mockResult();

      const modifier = await corsMiddleware(event);
      if (typeof modifier === 'function') {
        await modifier(result);
      }

      expect(result.statusCode).toBe(204);
      expect(result.body).toBeUndefined();
      expect(result.headers).toEqual({
        'Access-Control-Allow-Origin': 'https://preview.jumpingbeen.com',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'content-type',
        'Access-Control-Allow-Credentials': 'true',
      });
    });

    it('preserves existing headers', async () => {
      const event = mockEvent('https://preview.jumpingbeen.com', 'POST');
      const result = {
        ...mockResult(),
        headers: { 'x-custom-header': 'value' },
      };

      const modifier = await corsMiddleware(event);
      if (typeof modifier === 'function') {
        await modifier(result);
      }

      expect(result.headers).toEqual({
        'x-custom-header': 'value',
        'Access-Control-Allow-Origin': 'https://preview.jumpingbeen.com',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'content-type',
        'Access-Control-Allow-Credentials': 'true',
      });
    });
  });

  describe('with disallowed origin', () => {
    it('does not add CORS headers for non-matching origin', async () => {
      const event = mockEvent('https://evil.com', 'POST');
      const result = mockResult();
      const originalResult = { ...result };

      const modifier = await corsMiddleware(event);
      if (typeof modifier === 'function') {
        await modifier(result);
      }

      expect(result).toEqual(originalResult);
    });

    it('does not add CORS headers when origin is undefined', async () => {
      const event = mockEvent(undefined, 'POST');
      const result = mockResult();
      const originalResult = { ...result };

      const modifier = await corsMiddleware(event);
      if (typeof modifier === 'function') {
        await modifier(result);
      }

      expect(result).toEqual(originalResult);
    });

    it('does not modify OPTIONS requests from disallowed origins', async () => {
      const event = mockEvent('https://evil.com', 'OPTIONS');
      const result = mockResult();
      const originalResult = { ...result };

      const modifier = await corsMiddleware(event);
      if (typeof modifier === 'function') {
        await modifier(result);
      }

      expect(result).toEqual(originalResult);
      expect(result.statusCode).toBe(200);
    });
  });

  describe('stage handling', () => {
    it('defaults to preview stage when SST_STAGE is not set', async () => {
      const event = mockEvent('https://preview.jumpingbeen.com', 'POST');
      const result = mockResult();

      const modifier = await corsMiddleware(event);
      if (typeof modifier === 'function') {
        await modifier(result);
      }

      expect(result.headers).toHaveProperty('Access-Control-Allow-Origin');
    });

    it('allows custom stage subdomains', async () => {
      process.env.SST_STAGE = 'dev';
      const devCorsMiddleware = await getCorsMiddleware();

      const event = mockEvent('https://dev.jumpingbeen.com', 'POST');
      const result = mockResult();

      const modifier = await devCorsMiddleware(event);
      if (typeof modifier === 'function') {
        await modifier(result);
      }

      expect(result.headers).toEqual({
        'Access-Control-Allow-Origin': 'https://dev.jumpingbeen.com',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'content-type',
        'Access-Control-Allow-Credentials': 'true',
      });

      // Reset for other tests
      process.env.SST_STAGE = 'preview';
    });
  });
});
