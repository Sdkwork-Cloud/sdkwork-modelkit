# SDKWork Modelkit Technical Architecture

Status: active
Owner: SDKWork maintainers
Updated: 2026-07-02

## 1. Overview

```text
PC React (@sdkwork/modelkit-pc-react)
  -> pc-core SDK clients (preferences + catalog + commerce + IAM session)
  -> Vite proxy / cloud gateway
  -> sdkwork-modelkit-standalone-gateway (Axum + sdkwork-web-framework)
  -> preferences service + catalog service + sdkwork-database
  -> sdkwork-drive uploader (artifact bytes)
```

## 2. Persistence

| Layer | Storage | API |
| --- | --- | --- |
| User workspace / account / settings | `mk_preference_entry` | `/app/v3/api/modelkit/preferences/{namespace}` |
| Marketplace catalog | `mk_catalog_item` | `/app/v3/api/modelkit/catalog/{domain}/items` |
| Artifact bytes | sdkwork-drive | presign/confirm via `@sdkwork/drive-app-sdk` |

### Preference namespaces

- Workspace: `workspace.api_keys`, `workspace.relays`, `workspace.providers`, `workspace.request_logs`, `workspace.vip`, `workspace.agents`, `workspace.resources`, `workspace.agent_tools`
- Account: `account.billing`, `account.api_keys`
- User: `user.profile`
- System: `system.settings`
- Shop: `shop.cart`, `shop.orders`
- UI: `ui.settings`

### Catalog domains

`skillhub`, `plugins`, `relay`, `software`, `repos`, `news`, `shop`, `prompts`

## 3. Commerce

- Product catalog is global (`mk_catalog_item`, domain `shop`)
- Cart and orders are tenant-scoped preferences (`shop.cart`, `shop.orders`)
- Wallet balance lives in `account.billing`
- Shop checkout and VIP subscription both debit wallet and persist tenant state
- Virtual coupon codes for digital shop goods; coupon redemption credits wallet via pc-core helpers

## 4. Services layer

`@sdkwork/modelkit-services` registers preference-backed implementations for agents, resources, account, user, and system settings. No in-memory mock services remain.

Usage analytics derive from `workspace.request_logs` rather than static dashboard fixtures.

System settings (`system.settings` preference) drive debug level, TLS policy, cache flags, and theme. The system settings UI reads workspace relay status from `workspace.relays` instead of hardcoded port fixtures.

## 5. Security

- Authenticated app-api via IAM web adapter and dual-token headers
- No secrets or business state in browser `localStorage` (session tokens use `sessionStorage` only)
- Drive remains the only artifact byte storage boundary

## 6. SDK clients

- OpenAPI authority: `apis/app-api/modelkit/modelkit-app-api.openapi.json`
- Assembly: `sdks/sdkwork-modelkit-app-sdk/` (`sdkwork-v3` profile)
- **Current transport:** pc-core hand-written clients (`modelkitApiTransport`, preferences, catalog, commerce) using `@sdkwork/utils` envelope helpers
- **Generated SDK:** run `pnpm sdk:generate` when `@sdkwork/sdk-generator` is available in the workspace; until then `pnpm api:check` validates OpenAPI + assembly only

## 7. Drive port (Rust)

`crates/sdkwork-modelkit-drive` defines `ModelkitArtifactStorage` for future server-side presign. MVP artifact upload is client-side only via `@sdkwork/drive-app-sdk`; see crate `README.md`.

## 8. Verification

- `pnpm check:api-envelope`
- `pnpm topology:validate`
- `pnpm db:validate`
- `pnpm check`
