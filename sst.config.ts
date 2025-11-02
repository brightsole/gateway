/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'gateway',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: input?.stage === 'production',
      home: 'aws',
    };
  },
  async run() {
    const api = new sst.aws.ApiGatewayV2('Gateway', {
      domain: {
        name:
          $app.stage === 'production'
            ? 'api.jumpingbeen.com'
            : `api-${$app.stage}.jumpingbeen.com`,
      },
    });

    const wordsApiUrl = await aws.ssm.getParameter({
      name: `/sst/words-service/${$app.stage}/api-url`,
    });
    const hopsApiUrl = await aws.ssm.getParameter({
      name: `/sst/hops-service/${$app.stage}/api-url`,
    });
    const solvesApiUrl = await aws.ssm.getParameter({
      name: `/sst/solves-service/${$app.stage}/api-url`,
    });
    const gamesApiUrl = await aws.ssm.getParameter({
      name: `/sst/games-service/${$app.stage}/api-url`,
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
        WORDS_SERVICE_URL: wordsApiUrl.value,
        HOPS_SERVICE_URL: hopsApiUrl.value,
        SOLVES_SERVICE_URL: solvesApiUrl.value,
        GAMES_SERVICE_URL: gamesApiUrl.value,
      },
    };

    api.route('ANY /graphql', {
      ...functionConfig,
      handler: 'src/graphqlHandler.handler',
    });

    return {
      apiUrl: api.url.apply((url) => `${url}/graphql`),
    };
  },
});
