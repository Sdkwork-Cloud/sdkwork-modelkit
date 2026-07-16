//! Gateway assembly for the SDKWork ModelKit HTTP plane.

mod generated;

use axum::Router;
use sdkwork_modelkit_database_host::{build_application_services, ModelkitApplicationServices};
use sdkwork_routes_modelkit_app_api::state::ModelkitAppState;

pub struct ApplicationAssembly {
    pub router: Router,
}

pub fn assemble_application_business_router(
    services: ModelkitApplicationServices,
) -> ApplicationAssembly {
    let state = ModelkitAppState::new(services.preferences, services.catalog);
    ApplicationAssembly {
        router: sdkwork_routes_modelkit_app_api::gateway_mount(state),
    }
}

pub async fn assemble_application_business_router_from_env(
) -> Result<ApplicationAssembly, String> {
    let services = build_application_services().await?;
    let assembly = assemble_application_business_router(services);
    Ok(ApplicationAssembly {
        router: sdkwork_routes_modelkit_app_api::wrap_router_with_web_framework_from_env(
            assembly.router,
        )
        .await,
    })
}

pub async fn assemble_application_router() -> Result<ApplicationAssembly, String> {
    assemble_application_business_router_from_env().await
}

pub fn assembly_route_count() -> usize {
    generated::ROUTE_CRATE_COUNT
}
