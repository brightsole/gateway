import gql from 'graphql-tag';

// MUST BE IN LOCKSTEP WITH hops service
export enum ASSOCIATION_TYPES {
  // Algorithmic
  anagram = 'agram',

  // RiTa
  rhymes = 'rhyme',
  spelledLike = 'spelledLike',

  // overlap
  // hopefully we'll swap to RiTa
  soundsLike = 'soundsLike',

  // Datamuse
  meansLike = 'means',
  associatedWith = 'associated',
  comprisedWith = 'comprised',
  oppositeOf = 'opposite',
  isMoreSpecificTerm = 'moreSpecific',
  isMoreGeneralTerm = 'moreGeneral',
  popularNounPairings = 'popNounPair',
  popularAdjectivePairings = 'popAdjPair',
  aPartOf = 'aPart',
  commonlyFollowedBy = 'followedBy',
  commonlyPrecededBy = 'precededBy',
  homophoneOf = 'homophone', // might overlap soundsLike?
}
const HUMAN_READABLE_ASSOCIATION_TYPES: Record<ASSOCIATION_TYPES, string> = {
  agram: 'Anagram',
  rhyme: 'Rhymes',
  spelledLike: 'Spelled Like',
  soundsLike: 'Sounds Like',
  means: 'Means Like',
  associated: 'Associated With',
  comprised: 'Comprised With',
  opposite: 'Opposite Of',
  moreSpecific: 'Is More Specific Term',
  moreGeneral: 'Is More General Term',
  popNounPair: 'Popular Noun Pairings',
  popAdjPair: 'Popular Adjective Pairings',
  aPart: 'A Part Of',
  followedBy: 'Commonly Followed By',
  precededBy: 'Commonly Preceded By',
  homophone: 'Homophone Of',
};

export const typeDefs = gql`
  extend type Solve @key(fields: "id") {
    id: ID! @external
    linkTypes: [LinkType!]!
  }

  extend type Hop @key(fields: "id") {
    id: ID! @external
    linkTypes: [LinkType!]!
  }

  type LinkType @key(fields: "id") {
    id: ID!
    name: String!
  }
`;

type ParentWithAssociations = {
  associationsKey: string;
  [key: string]: unknown;
};

type LinkType = {
  id: string;
  name: string;
};

const VALID_ASSOCIATION_VALUES = Object.values(ASSOCIATION_TYPES);

const isValidAssociationType = (key: string): key is ASSOCIATION_TYPES => {
  const isValid = VALID_ASSOCIATION_VALUES.includes(key as ASSOCIATION_TYPES);
  if (!isValid) {
    console.error(
      `Invalid association type encountered: "${key}". Valid types are: ${VALID_ASSOCIATION_VALUES.join(', ')}`,
    );
  }
  return isValid;
};

export const makeAssociationKeyReadable = (key?: string): LinkType[] => {
  if (!key) return [];

  const associationKeys = key.split('|');

  return associationKeys.filter(isValidAssociationType).map((k) => ({
    id: k,
    name: HUMAN_READABLE_ASSOCIATION_TYPES[k],
  }));
};

export const resolvers = {
  Solve: {
    __resolveReference(reference: ParentWithAssociations) {
      return reference;
    },
    linkTypes: (parent: ParentWithAssociations) =>
      makeAssociationKeyReadable(parent.associationsKey),
  },
  Hop: {
    __resolveReference(reference: ParentWithAssociations) {
      return reference;
    },
    linkTypes: (parent: ParentWithAssociations) =>
      makeAssociationKeyReadable(parent.associationsKey),
  },
};
