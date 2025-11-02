import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import createTestGateway from '../src/testGateway';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (_context: any = {}) => {
  const gateway = createTestGateway();

  return new ApolloServer<typeof _context>({
    gateway,
    introspection: true,
    plugins: [ApolloServerPluginInlineTraceDisabled()],
  });
};
