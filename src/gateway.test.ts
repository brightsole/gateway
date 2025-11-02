import { gql } from 'graphql-tag';
import getGraphqlServer from '../test/getGraphqlServer';

// INTEGRATION TEST OF THE FEDERATION GATEWAY
// Tests that the gateway can be created and introspect its schema

describe('Federation Gateway', () => {
  it('creates a gateway server without error', async () => {
    const server = await getGraphqlServer();
    expect(server).toBeDefined();
  });

  it('can introspect the gateway schema', async () => {
    const server = await getGraphqlServer();

    const introspectionQuery = gql`
      query IntrospectionQuery {
        __schema {
          queryType {
            name
          }
          mutationType {
            name
          }
        }
      }
    `;

    const { body } = await server.executeOperation(
      {
        query: introspectionQuery,
      },
      {
        contextValue: {
          userId: 'test-user',
        },
      },
    );

    if (body.kind !== 'single') {
      throw new Error('Expected a single GraphQL response');
    }

    const { singleResult } = body;

    expect(singleResult.errors).toBeUndefined();
    expect(singleResult.data).toEqual({
      __schema: {
        queryType: { name: 'Query' },
        mutationType: { name: 'Mutation' },
      },
    });
  });

  it('exposes federated types from multiple services', async () => {
    const server = await getGraphqlServer();

    const typesQuery = gql`
      query GetTypes {
        __schema {
          types {
            name
            kind
          }
        }
      }
    `;

    const { body } = await server.executeOperation(
      {
        query: typesQuery,
      },
      {
        contextValue: {
          userId: 'test-user',
        },
      },
    );

    if (body.kind !== 'single') {
      throw new Error('Expected a single GraphQL response');
    }

    const { singleResult } = body;

    expect(singleResult.errors).toBeUndefined();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schema = (singleResult.data as any)?.__schema;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const typeNames = schema?.types?.map((type: any) => type.name);

    // Check that both Item and User types are available (from different services)
    expect(typeNames).toContain('Item');
    expect(typeNames).toContain('User');
    expect(typeNames).toContain('Query');
    expect(typeNames).toContain('Mutation');
  });
});
