use crate::handlers;
use crate::paths;
use crate::state::ModelkitAppState;
use axum::routing::get;
use axum::Router;
use sdkwork_modelkit_catalog_service::CatalogRepository;
use sdkwork_modelkit_preferences_service::PreferenceRepository;

pub fn build_router<P, C>(state: ModelkitAppState<P, C>) -> Router
where
    P: PreferenceRepository + Clone + 'static,
    C: CatalogRepository + Clone + 'static,
{
    Router::new()
        .route(
            paths::PREFERENCE,
            get(handlers::get_preference::<P, C>).put(handlers::put_preference::<P, C>),
        )
        .route(
            paths::CATALOG_ITEMS,
            get(handlers::list_catalog_items::<P, C>).post(handlers::create_catalog_item::<P, C>),
        )
        .route(
            paths::CATALOG_ITEM,
            get(handlers::get_catalog_item::<P, C>).patch(handlers::patch_catalog_item::<P, C>),
        )
        .route(
            paths::CATALOG_CATEGORIES,
            get(handlers::list_catalog_categories::<P, C>),
        )
        .with_state(state)
}
