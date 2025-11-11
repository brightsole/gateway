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
    // Create internal auth secret for service-to-service communication
    const internalAuthSecret = new aws.secretsmanager.Secret(
      'InternalLockdownSecret',
      {
        name: `jumpingbeen/${$app.stage}/internal-lockdown`,
        description: 'Internal service-to-service authentication secrets',
      },
    );

    const internalAuthSecretVersion = new aws.secretsmanager.SecretVersion(
      'InternalLockdownSecretVersion',
      {
        secretId: internalAuthSecret.id,
        secretString: JSON.stringify({
          INTERNAL_SECRET_HEADER_NAME: process.env.INTERNAL_SECRET_HEADER_NAME,
          INTERNAL_SECRET_HEADER_VALUE:
            process.env.INTERNAL_SECRET_HEADER_VALUE,
        }),
      },
    );

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

    const authSecrets = internalAuthSecretVersion.secretString.apply((s) =>
      JSON.parse(s!),
    );

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
        INTERNAL_SECRET_HEADER_NAME: authSecrets.apply(
          (s) => s.INTERNAL_SECRET_HEADER_NAME,
        ),
        INTERNAL_SECRET_HEADER_VALUE: authSecrets.apply(
          (s) => s.INTERNAL_SECRET_HEADER_VALUE,
        ),
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
