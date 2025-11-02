import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import env from './env';
import { AuthenticatedDataSource } from './authenticatedDataSource';

export const createGateway = () =>
  new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        {
          name: 'items',
          url: `${env.services.items}/graphql`,
        },
        {
          name: 'users',
          url: `${env.services.users}/graphql`,
        },
        // Add more microservices here as needed
      ],
    }),
    buildService({ url }) {
      return new AuthenticatedDataSource({ url });
    },
  });

export default createGateway;
