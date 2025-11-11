import type { middleware } from '@as-integrations/aws-lambda';
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import env from './env';

const corsMiddleware: middleware.LambdaRequest<
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2
> = async (event: APIGatewayProxyEventV2) => {
  const allowedOrigin = env.isProduction
    ? 'https://jumpingbeen.com'
    : `https://${env.stage}.jumpingbeen.com`;

  const origin = event.headers.origin;

  if (origin === allowedOrigin) {
    return (result) => {
      result.headers = {
        ...result.headers,
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        // TODO: remove x-user-id when auth implemented
        'Access-Control-Allow-Headers':
          'content-type, x-user-id, x-game-id, x-attempt-id',
        'Access-Control-Allow-Credentials': 'true',
      };

      if (event.requestContext.http.method === 'OPTIONS') {
        result.body = undefined;
        result.statusCode = 204;
      }

      return Promise.resolve();
    };
  }

  return () => Promise.resolve();
};

export default corsMiddleware;
