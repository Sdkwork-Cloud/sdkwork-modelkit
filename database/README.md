# Modelkit Database

Owner: `sdkwork-modelkit`.

This directory owns the Modelkit relational schema contract and lifecycle assets. Runtime hosts
bootstrap these assets through `sdkwork-database` using the process-shared pool before constructing
Modelkit application services.

Supported engines: PostgreSQL and SQLite.

Verification:

```bash
pnpm db:validate
cargo test -p sdkwork-modelkit-database-host
```

## Initialization state

This module is in **initialization state** for greenfield deployments:

1. **Baseline** — `database/ddl/baseline/{engine}/0001_modelkit_baseline.sql` contains the full DDL snapshot.
2. **Migrations** — `database/migrations/{engine}/` is reserved for post-GA incremental schema changes only. It is intentionally empty at initialization.
3. **Drift** — run `pnpm db:drift:check` before release.

## Commands

```bash
pnpm run db:validate
pnpm run db:materialize:contract
pnpm run db:plan
pnpm run db:init
pnpm run db:migrate
pnpm run db:seed
pnpm run db:status
pnpm run db:drift:check
```
