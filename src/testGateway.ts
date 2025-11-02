import { ApolloGateway } from '@apollo/gateway';

// Static supergraph SDL for testing - represents a basic federated schema
const testSupergraphSdl = `
  schema
    @link(url: "https://specs.apollo.dev/link/v1.0")
    @link(url: "https://specs.apollo.dev/join/v0.3", for: EXECUTION)
  {
    query: Query
    mutation: Mutation
  }

  directive @join__enumValue(graph: join__Graph!) repeatable on ENUM_VALUE

  directive @join__field(graph: join__Graph, requires: join__FieldSet, provides: join__FieldSet, type: String, external: Boolean, override: String, usedOverridden: Boolean) repeatable on FIELD_DEFINITION | INPUT_FIELD_DEFINITION

  directive @join__graph(name: String!, url: String!) on ENUM_VALUE

  directive @join__implements(graph: join__Graph!, interface: String!) repeatable on OBJECT | INTERFACE

  directive @join__type(graph: join__Graph!, key: join__FieldSet, extension: Boolean! = false, resolvable: Boolean! = true, isInterfaceObject: Boolean! = false) repeatable on OBJECT | INTERFACE | UNION | ENUM | INPUT_OBJECT | SCALAR

  directive @join__unionMember(graph: join__Graph!, member: String!) repeatable on UNION

  directive @link(url: String, as: String, for: link__Purpose, import: [link__Import]) repeatable on SCHEMA

  scalar join__FieldSet

  enum join__Graph {
    ITEMS @join__graph(name: "items", url: "http://localhost:4001/graphql")
    USERS @join__graph(name: "users", url: "http://localhost:4002/graphql")
  }

  scalar link__Import

  enum link__Purpose {
    EXECUTION
    SECURITY
  }

  type Query
    @join__type(graph: ITEMS)
    @join__type(graph: USERS)
  {
    item(id: ID!): Item @join__field(graph: ITEMS)
    items: [Item] @join__field(graph: ITEMS)
    user(id: ID!): User @join__field(graph: USERS)
    users: [User] @join__field(graph: USERS)
  }

  type Mutation
    @join__type(graph: ITEMS)
    @join__type(graph: USERS)
  {
    createItem(name: String!, description: String): Item @join__field(graph: ITEMS)
    updateItem(id: ID!, name: String, description: String): Item @join__field(graph: ITEMS)
    deleteItem(id: ID!): Boolean @join__field(graph: ITEMS)
    createUser(name: String!, email: String!): User @join__field(graph: USERS)
    updateUser(id: ID!, name: String, email: String): User @join__field(graph: USERS)
    deleteUser(id: ID!): Boolean @join__field(graph: USERS)
  }

  type Item
    @join__type(graph: ITEMS, key: "id")
  {
    id: ID!
    name: String!
    description: String
    ownerId: ID!
  }

  type User
    @join__type(graph: USERS, key: "id")
  {
    id: ID!
    name: String!
    email: String!
  }
`;

export const createTestGateway = () => {
  return new ApolloGateway({
    supergraphSdl: testSupergraphSdl,
    debug: true,
  });
};

export default createTestGateway;
