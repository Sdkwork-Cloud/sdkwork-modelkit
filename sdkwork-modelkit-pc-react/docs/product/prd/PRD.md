# SDKWork Modelkit PRD

Status: active
Owner: SDKWork maintainers
Application: sdkwork-modelkit-pc
Updated: 2026-07-02

## 1. Background And Problem

Modelkit provides a PC workspace for API keys, relays, marketplace browsing, skill/plugin publishing, and operator tooling. The application must align with SDKWork platform standards before production launch.

## 2. Goals

- Tenant-scoped persistence through modelkit app-api and sdkwork-database
- File artifacts uploaded only through sdkwork-drive (frontend uploader + backend port boundary)
- SdkWorkApiResponse / ProblemDetail HTTP contracts on all app-api routes
- PC application root architecture per APP_PC_ARCHITECTURE_SPEC
- Wallet-backed commerce for shop checkout and VIP subscription activation (wallet-only enforcement in pc-core `shopCommerce`)

## 3. Non-Goals (current phase)

- sdkwork-discovery / RPC services (deferred until RPC surfaces exist)
- External PSP integrations (WeChat Pay / Alipay / card gateways) before wallet MVP launch
- Server-side relay traffic ingestion (usage analytics derive from persisted request logs)

## 4. Success Metrics

- `pnpm verify` and `cargo test --workspace` pass
- No legacy HTTP envelopes in application handlers
- Upload modals route through drive adapter boundary
- No in-memory mock services or browser localStorage business persistence
