//! Application-specific gateway bootstrap for sdkwork-modelkit.

use axum::Router;
use sdkwork_modelkit_database_host::{build_application_services, ModelkitApplicationServices};
use sdkwork_routes_modelkit_app_api::state::ModelkitAppState;

pub struct ApiAssembly {
    pub router: Router,
}

pub fn assemble_api_router(
    services: ModelkitApplicationServices,
) -> ApiAssembly {
    let state = ModelkitAppState::new(services.preferences, services.catalog);
    ApiAssembly {
        router: sdkwork_routes_modelkit_app_api::gateway_mount(state),
    }
}

pub async fn assemble_api_router_from_env() -> Result<ApiAssembly, String>
{
    let services = build_application_services().await?;
    let assembly = assemble_api_router(services);
    Ok(ApiAssembly {
        router: sdkwork_routes_modelkit_app_api::wrap_router_with_web_framework_from_env(
            assembly.router,
        )
        .await,
    })
}

pub async fn assemble_api_router() -> Result<ApiAssembly, String> {
    assemble_api_router_from_env().await
}
