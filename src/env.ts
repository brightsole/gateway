import { cleanEnv, str, url } from 'envalid';

const env = cleanEnv(process.env, {
  AWS_REGION: str({ default: 'ap-southeast-2' }),
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
    default: 'development',
  }),
  SST_STAGE: str({
    desc: 'SST deployment stage',
    default: 'preview',
  }),
  // Microservice URLs for federation
  WORDS_SERVICE_URL: url({
    desc: 'Words microservice GraphQL endpoint URL',
    default: 'http://localhost:4001',
  }),
  HOPS_SERVICE_URL: url({
    desc: 'Hops microservice GraphQL endpoint URL',
    default: 'http://localhost:4002',
  }),
  SOLVES_SERVICE_URL: url({
    desc: 'Solves microservice GraphQL endpoint URL',
    default: 'http://localhost:4003',
  }),
  GAMES_SERVICE_URL: url({
    desc: 'Games microservice GraphQL endpoint URL',
    default: 'http://localhost:4004',
  }),
  // Internal service authentication
  INTERNAL_SECRET_HEADER_NAME: str({
    desc: 'Header name for internal service authentication',
    default: 'x-internal-auth',
  }),
  INTERNAL_SECRET_HEADER_VALUE: str({
    desc: 'Secret value for internal service authentication',
    default: 'change-me-in-production',
  }),
  // Add more service URLs as needed
});

export default {
  region: env.AWS_REGION,
  isProduction: env.NODE_ENV === 'production',
  stage: env.SST_STAGE,
  services: {
    words: env.WORDS_SERVICE_URL,
    hops: env.HOPS_SERVICE_URL,
    solves: env.SOLVES_SERVICE_URL,
    games: env.GAMES_SERVICE_URL,
  },
  internalAuth: {
    headerName: env.INTERNAL_SECRET_HEADER_NAME,
    headerValue: env.INTERNAL_SECRET_HEADER_VALUE,
  },
};
