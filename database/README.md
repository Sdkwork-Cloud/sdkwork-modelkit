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
