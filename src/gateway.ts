import {
  ApolloGateway,
  IntrospectAndCompose,
  LocalGraphQLDataSource,
} from '@apollo/gateway';
import { buildSubgraphSchema } from '@apollo/subgraph';
import env from './env';
import { AuthenticatedDataSource } from './authenticatedDataSource';
import { typeDefs, resolvers } from './linkTypesResolver';

export const createGateway = () =>
  new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        {
          name: 'associations',
          url: 'http://in-memory/graphql', // Local resolver, URL not actually used
        },
        {
          name: 'words',
          url: `${env.services.words}/graphql`,
        },
        {
          name: 'hops',
          url: `${env.services.hops}/graphql`,
        },
        {
          name: 'solves',
          url: `${env.services.solves}/graphql`,
        },
        {
          name: 'games',
          url: `${env.services.games}/graphql`,
        },
        // Add more microservices here as needed
      ],
    }),
    buildService({ name, url }) {
      if (name === 'associations') {
        return new LocalGraphQLDataSource(
          buildSubgraphSchema({ typeDefs, resolvers }),
        );
      }
      return new AuthenticatedDataSource({ url });
    },
  });

export default createGateway;
