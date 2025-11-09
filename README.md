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

## TODOS

1. add actual auth
1. deploy to prod
1. backport any/all other nice changes from reuniclus-sst
