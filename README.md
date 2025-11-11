# FEDERATION GATEWAY

[![Auto merge basic check](https://github.com/brightsole/gateway/actions/workflows/test.yml/badge.svg)](https://github.com/brightsole/gateway/actions/workflows/test.yml) [![Deploy preview environment](https://github.com/brightsole/gateway/actions/workflows/deploy-preview.yml/badge.svg)](https://github.com/brightsole/gateway/actions/workflows/deploy-preview.yml)

[development](https://api-preview.jumpingbeen.com/graphql)

<pre>
                      ┌────────────────────────────────────────────────────────────────┐
                      │    <a href="https://github.com/brightsole/jumpingbeen.com">jumpingbeen.com</a>                                             │
                      └─────────────┬─▲────────────────────────────────────────────────┘
                                    │ │
                      ┌───────────────────────────────────────────────────────────┐
                      │    <a href="https://github.com/brightsole/gateway">Federation gateway</a>                                     * you're here
                      │───────────────────────────────────────────────────────────┼───┐
    ┌────────────────►│   DMZ                                                     ◄──┐│
  ┌──────────────────►└───────────────────────────────────────────────────────────┘  ││
  │ │                   ▲                                                      ▲     ││
  │ │                   │                                                      │     ││
  │ │                 ┌─┴────────────────────────────────────────────────────┐ │  ┌──┴▼──────────────────┐
  │ │                 │    <a href="https://github.com/brightsole/solves">Solves service</a>                                    │ │  │ Users service (soon) │
  │ │                 └┬───────────▲───┬─▲────────┬▲────────┬▲───────────────┘ │  └──────────────────────┘
  │ │                  │           │   │ │        ││        ││                 │
  │ │                  │Attempts   │ ┌─▼─┴────┐   ││        ││                 │
  │ │                  │ are       │ ┌────────┐   ││        ││                 │
  │ │                  │memory only│ │  DDB   │   ││        ││                 │
  │ │                  └───────────┘ │ Solves │   ││        ││                 │
  │ │                                └────────┘   ││        ││                 │
  │┌┴─────────────────────────────────────────────▼┴──┐   ┌─▼┴─────────────────┴─────────────────────────┐
  ││    <a href="https://github.com/brightsole/hops">Hops service</a>                                  ├───►<a href="https://github.com/brightsole/games">    Games service</a>                             │
  │└──────▲┬─────────┬─▲─────────┬────────────┬─▲─────◄───┴──┬─▲─────────────────────────────────────────┘
  │       ││         │ │         │            │ │            │ │
  │       ││       ┌─▼─┴───┐     │User      ┌─▼─┴───┐      ┌─▼─┴───┐
  │       ││       ┌───────┐     │Goo       ┌───────┐      ┌───────┐
  │       ││       │  DDB  │     │          │  DDB  │      │  DDB  │
  │       ││       │ Links ├───┐ └─────────►│ Hops  │      │ Games │
  │       ││       └───────┘   └───────────►└───────┘      └───────┘
 ┌┴───────┴▼──────────────────────────────────────────┐
 │    <a href="https://github.com/brightsole/words">Words service</a>                                   │
 └──────┬───────────────────────▲─────┬─▲─────────────┘
        │                       │     │ │
        ├─────►Dictionary api───┤   ┌─▼─┴───┐
        │                       │   ┌───────┐
        ├─────►RiTa package─────┤   │  DDB  │
        │                       │   │ Words │
        └─────►Datamuse api─────┘   └───────┘
</pre>

### Interesting things to know

We run the entire stack as a DMZ. If you have a user id, you're assumed to be legit.

Yes. This is stupid when we don't have an auth service to get that user id. But that won't be the case for long.

Double stupid to do this when every single service has a publicly acessible internet address.

The solution to that second point is [here.](https://github.com/brightsole/gateway/blob/main/src/authenticatedDataSource.ts#L18-L21)

Our gateway talks to its children using a secret header name, and a secret header value, set in our github secrets [here](https://github.com/brightsole/gateway/blob/main/.github/workflows/deploy-preview.yml#L51-L52).

That way an admin still has full access, but it's impossible for someone to crack. We don't tell you which field we're looking for, nor its value. I think it's relatively clever, and until anyone tells me otherwise, i'm going to assume it's completely secure... as soon as i set up rate limiting. The only thing it'll hurt is my (and the hackers) wallet otherwise.

## TODOS

1. add actual auth
1. deploy to prod
1. backport any/all other nice changes from reuniclus-sst
