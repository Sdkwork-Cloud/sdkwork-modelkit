# Repository Guidelines

## SDKWORK Soul

Read `../sdkwork-specs/SOUL.md` before executing tasks in this root.

## SDKWORK Standards

- `../sdkwork-specs/README.md`
- `../sdkwork-specs/SOUL.md`
- `../sdkwork-specs/AGENTS_SPEC.md`

## Application Identity

- Repository root: `sdkwork-modelkit`
- PC React surface: `sdkwork-modelkit-pc-react/`
- App manifest: `sdkwork-modelkit-pc-react/sdkwork.app.config.json`

## Build, Test, and Verification

Run from this directory:

- `pnpm dev` — browser + standalone gateway
- `pnpm check` — standards + cargo check + API envelope
- `pnpm verify` — tests + check aggregate
- `cargo test --workspace` — Rust tests

## App SDK Consumer Imports



Application, feature, shell, and service packages `MUST` consume HTTP SDKs through scoped composed consumer packages, not generator transport package names.



- App API clients: `@sdkwork/<application-code>-app-sdk`

- Backend API clients (`backend-admin` only): `@sdkwork/<application-code>-backend-sdk`

- Federated Claw Router domain surfaces: `@sdkwork/clawrouter-app-sdk/domains` and `@sdkwork/clawrouter-backend-sdk/domains`

- Open/domain API clients: `@sdkwork/<domain>-sdk`



Canonical examples (IAM):



```typescript

import { createClient, type SdkworkAppClient } from '@sdkwork/iam-app-sdk';

import type { SdkworkBackendClient } from '@sdkwork/iam-backend-sdk'; // backend-admin only

import { createClient as createClawRouterDomainsClient } from '@sdkwork/clawrouter-app-sdk/domains';

```



Forbidden in application `apps/`, `packages/`, bootstrap, services, UI, contract tests, and composed SDK `src/**` outside generator ownership:



- `sdkwork-*-app-sdk-generated-typescript`, `sdkwork-*-backend-sdk-generated-typescript`, and other generator transport names as consumer imports

- `@sdkwork/commerce-app-sdk`, `@sdkwork/commerce-backend-sdk`, `@sdkwork/clawrouter-*-domain-transport-sdk`

- filesystem paths containing `domain-transport-typescript`, `domain-transport-sdk`, or sibling `*-typescript/generated` hops from composed `src/**`

- deep imports into `generated/server-openapi/src/*` from consumers when a composed facade exists



Allowed:



- Composed facade entry imports such as `@sdkwork/iam-app-sdk`, `@sdkwork/knowledgebase-app-sdk`, and `@sdkwork/clawrouter-app-sdk/domains`

- Composed re-exports that import only from `../generated/**` within the same `*-sdk-typescript` family root

- Generated transport ownership inside `sdks/**/generated/**` only



Each SDK family `MUST` expose the composed TypeScript facade at `sdks/<sdk-family>/<sdk-family>-typescript/src/index.ts` (and optional subpath exports such as `./domains`) with `package.json#name` equal to the scoped consumer package.



Before completing SDK integration or frontend service work, run:



```bash

node <sdkwork-specs>/tools/check-app-sdk-consumer-imports.mjs --workspace <workspace-root>

```



Authority: `APP_SDK_INTEGRATION_SPEC.md` section 9, `SDK_SPEC.md` package naming table, `SDK_WORKSPACE_GENERATION_SPEC.md` composed facade rules.



## HTTP API Response Envelope

All app-api handlers MUST use `SdkWorkApiResponse` and `ProblemDetail` per `../sdkwork-specs/API_SPEC.md` section 15.

## List And Search Pagination

All L2+ list/search APIs and their backing services, repositories, SDK consumers, and interactive frontend lists `MUST` follow `PAGINATION_SPEC.md`:

- **Input:** standard `SdkWorkListQuery` or query params (`page`/`page_size` or `cursor`/`page_size` per `API_SPEC.md` §14.1); default `page_size` `20`; max `200` unless a documented exception exists.
- **Output:** `SdkWorkApiResponse.data.items` + `data.pageInfo` with `PageInfo.mode` (`offset` or `cursor`) per `API_SPEC.md` §16.
- **Store-level pagination:** push filtering, sorting, and page selection to SQL `LIMIT`/keyset or incrementally maintained indexes — never unbounded collect then `skip`/`take`/`slice` in process memory (`PAGINATION_SPEC.md` §2).
- **SDK and frontend:** interactive lists request one page at a time from the server; no default `listAll*` on P0/P1 paths; no client-side `slice` pagination over full downloads.

Before completing list/search API, repository, SDK list helper, projection read model, or paginated UI work, run:

```bash
node <sdkwork-specs>/tools/check-pagination.mjs --workspace <workspace-root>
```

Authority: `PAGINATION_SPEC.md`, `API_SPEC.md` §14.1/§16, `DATABASE_SPEC.md` §20.5, `WEB_BACKEND_SPEC.md` §12, `SDK_SPEC.md` §4.2/§6, `FRONTEND_SPEC.md`, `APP_SDK_INTEGRATION_SPEC.md` §9.
