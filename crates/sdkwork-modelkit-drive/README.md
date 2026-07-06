# sdkwork-modelkit-drive

Rust port boundary for Modelkit artifact storage. Business crates depend on `ModelkitArtifactStorage`, not sdkwork-drive internals.

## Current scope

- **MVP (pre-launch):** artifact upload runs in the PC client via `@sdkwork/drive-app-sdk` (`ModelkitDriveUploadService` in pc-core). Plugin and marketplace publish flows use presign/confirm on the app surface.
- **Backend adapter:** `UnconfiguredDriveAdapter` returns a clear error until drive workspace env and a concrete adapter are wired into the gateway. No server-side presign routes are exposed yet.

## When to implement the adapter

Add a configured implementation when Modelkit needs server-side presign (for example batch imports, headless publish, or admin tooling). Wire it through `ModelkitApplicationServices` in the standalone gateway bootstrap; keep OpenAPI unchanged until a dedicated app-api operation is required.

## Related

- Frontend: `sdkwork-modelkit-pc-react/packages/sdkwork-modelkit-pc-core/src/host/driveUpload.ts`
- SDK assembly dependency: `sdks/sdkwork-modelkit-app-sdk/.sdkwork-assembly.json` → `sdkwork-drive-app-sdk`
