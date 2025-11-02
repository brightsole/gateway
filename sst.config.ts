/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'federation-gateway',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: input?.stage === 'production',
      home: 'aws',
    };
  },
  async run() {
    const api = new sst.aws.ApiGatewayV2('Api');

    const itemsApiUrl = await aws.ssm.getParameter({
      name: `/sst/items-service/${$app.stage}/api-url`,
    });
    const usersApiUrl = await aws.ssm.getParameter({
      name: `/sst/users-service/${$app.stage}/api-url`,
    });

    const functionConfig = {
      runtime: 'nodejs22.x' as const,
      timeout: '30 seconds' as const,
      memory: '1024 MB' as const,
      nodejs: {
        format: 'esm' as const,
        install: ['graphql'],
        esbuild: {
          external: ['graphql'],
        },
      },
      environment: {
        // starter: solosis-sst used as items
        ITEMS_SERVICE_URL: itemsApiUrl.value,
        // starter: duosion-sst used as users/auth
        USERS_SERVICE_URL: usersApiUrl.value,
      },
    };

    api.route('ANY /graphql', {
      ...functionConfig,
      handler: 'src/graphqlHandler.handler',
    });

    return {
      apiUrl: api.url,
    };
  },
});
