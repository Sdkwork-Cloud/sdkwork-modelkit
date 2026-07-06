use axum::Router;
use sdkwork_modelkit_database_host::ModelkitApplicationServices;

pub struct ApplicationAssembly {
    pub router: Router,
}

pub fn assemble_application_business_router(services: ModelkitApplicationServices) -> ApplicationAssembly {
    let state = sdkwork_routes_modelkit_app_api::state::ModelkitAppState::new(
        services.preferences,
        services.catalog,
    );
    let app_router = sdkwork_routes_modelkit_app_api::gateway_mount(state);
    let auth_router = sdkwork_routes_modelkit_http_auth::gateway_mount();
    ApplicationAssembly {
        router: Router::new().merge(app_router).merge(auth_router),
    }
}
