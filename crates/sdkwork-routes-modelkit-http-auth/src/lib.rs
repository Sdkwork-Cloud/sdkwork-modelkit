pub mod actor_context;
pub mod auth;
pub mod permissions;
pub mod response;

pub use auth::authenticated_actor;
pub use response::{
    finish_api_json, finish_created_json, map_catalog_error, map_product_error, ApiProblem, ApiResult,
};

pub fn gateway_mount() -> axum::Router {
    axum::Router::new()
}
