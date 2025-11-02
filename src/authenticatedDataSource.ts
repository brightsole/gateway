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

      // Forward the user id and let downstream services handle auth
      if (context?.userId) {
        request.http.headers.set('x-user-id', context.userId);
      }
    }
  }
}
