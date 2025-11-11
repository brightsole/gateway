import {
  RemoteGraphQLDataSource,
  GraphQLDataSourceProcessOptions,
} from '@apollo/gateway';
import env from './env';
import type { Context } from './types';

// Custom data source that adds internal authentication header
export class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest(options: GraphQLDataSourceProcessOptions<Context>) {
    const { request, context } = options;

    // Add the internal secret header to all downstream requests
    // allows us to do the dodgy security lockdown
    // services will still be internet accessible, but requests without
    // the correct header will be rejected without even hitting the lambda
    if (request.http) {
      request.http.headers.set(
        env.internalAuth.headerName,
        env.internalAuth.headerValue,
      );

      // TODO: swap to a real userId when auth is implemented
      // underlying services are high trust, but still do auth based on userId
      if (context?.userId) {
        request.http.headers.set('x-user-id', context.userId);
      }

      if (context?.gameId) {
        request.http.headers.set('x-game-id', context.gameId);
      }
      if (context?.attemptId) {
        request.http.headers.set('x-attempt-id', context.attemptId);
      }
    }
  }
}
