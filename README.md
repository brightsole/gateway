# Federation Gateway (REUNICLUS-SST)

[![Auto merge basic check](https://github.com/brightsole/solosis-sst/actions/workflows/test.yml/badge.svg)](https://github.com/brightsole/solosis-sst/actions/workflows/test.yml) [![Deploy preview environment](https://github.com/brightsole/solosis-sst/actions/workflows/deploy-preview.yml/badge.svg)](https://github.com/brightsole/solosis-sst/actions/workflows/deploy-preview.yml)

[<img src="reuniclus.svg?sanitize=true" height=250>]()

## INFO

This is a GraphQL Federation Gateway service built with Apollo Gateway and SST. It automatically discovers and stitches together schemas from multiple microservices, creating a unified GraphQL API endpoint.

### RUNNING THE GATEWAY

run the gateway locally with `npm start`
deploy the gateway to SST by configuring the github action. you'll need to set up OIDC and aws creds and do it for every microservice you want connected.

#### Slightly dodgy auth system

The gateway automatically adds a secret header to all downstream requests for security:

```bash
INTERNAL_SECRET_HEADER_NAME=x-internal-auth  # Header name (don't name it this)
INTERNAL_SECRET_HEADER_VALUE=your-secret-value  # Secret value
```

Your microservices should check for this header before processing requests. Code forthcoming.

This means you can still access downstream services as an admin without doing anything other than adding headers.

## TODOS

1. Add standardised health checks solution
1. Put api url for graphiql into readme
1. Add links to items & users
1. deploy it once users (duosion) is up
1. Implement caching strategies for schema introspection
    1. stash it S3?
1. Add monitoring and metrics for query performance
1. Configure caching and retry policies for services


<a href="https://www.buymeacoffee.com/Ao9uzMG" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
