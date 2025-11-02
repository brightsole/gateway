import { AuthenticatedDataSource } from './authenticatedDataSource';
import env from './env';

// Simple integration test to verify the class can be instantiated
describe('AuthenticatedDataSource', () => {
  it('can be instantiated with a URL', () => {
    const dataSource = new AuthenticatedDataSource({
      url: 'http://test.com',
    });

    expect(dataSource).toBeDefined();
    expect(dataSource).toBeInstanceOf(AuthenticatedDataSource);
  });

  it('exposes the willSendRequest method', () => {
    const dataSource = new AuthenticatedDataSource({
      url: 'http://test.com',
    });

    expect(dataSource.willSendRequest).toBeDefined();
    expect(typeof dataSource.willSendRequest).toBe('function');
  });

  it('configures internal auth environment variables', () => {
    // Verify our env config is available
    expect(env.internalAuth.headerName).toBeDefined();
    expect(env.internalAuth.headerValue).toBeDefined();
    expect(typeof env.internalAuth.headerName).toBe('string');
    expect(typeof env.internalAuth.headerValue).toBe('string');
  });
});
