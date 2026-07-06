# SDKWork Modelkit PC

SDKWork Modelkit PC React application surface.

## Commands

- `pnpm dev` — Vite dev server with app-api proxy
- `pnpm build` — production static bundle
- `pnpm typecheck` — TypeScript verification

## Architecture

- UI packages under `packages/`
- Composition and SDK clients under `packages/sdkwork-modelkit-pc-core` (shared API transport, preferences, catalog, commerce)
- Runtime bootstrap under `src/bootstrap/`
- Persistent user state via modelkit app-api preference namespaces (no business `localStorage`)
- Shop checkout uses wallet balance in `account.billing` preference namespace

## Configuration

Copy `config/browser/runtime-env.development.example.json` values into `.env.development` for local standalone development.
