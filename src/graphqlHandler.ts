import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from '@as-integrations/aws-lambda';
import createGateway from './gateway';
import setContext from './setContext';

export const createGraphqlServer = async () => {
  const gateway = createGateway();

  return new ApolloServer({
    gateway,
    introspection: true,
    plugins: [ApolloServerPluginInlineTraceDisabled()],
  });
};

export const handler = startServerAndCreateLambdaHandler(
  await createGraphqlServer(),
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: setContext,
  },
);
