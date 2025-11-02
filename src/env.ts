import { cleanEnv, str, url } from 'envalid';

const env = cleanEnv(process.env, {
  AWS_REGION: str({ default: 'ap-southeast-2' }),
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
    default: 'development',
  }),
  // Microservice URLs for federation
  ITEMS_SERVICE_URL: url({
    desc: 'Items microservice GraphQL endpoint URL',
    default: 'http://localhost:4001',
  }),
  USERS_SERVICE_URL: url({
    desc: 'Users microservice GraphQL endpoint URL',
    default: 'http://localhost:4002',
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
  services: {
    items: env.ITEMS_SERVICE_URL,
    users: env.USERS_SERVICE_URL,
  },
  internalAuth: {
    headerName: env.INTERNAL_SECRET_HEADER_NAME,
    headerValue: env.INTERNAL_SECRET_HEADER_VALUE,
  },
};
