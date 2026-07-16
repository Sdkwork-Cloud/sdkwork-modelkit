use crate::dto::{
    CatalogItemResponse, CatalogListQueryParams, CreateCatalogItemRequest, PatchCatalogItemRequest,
    PreferenceResponse, PutPreferenceRequest,
};
use crate::envelope::{list_page, resource_data};
use crate::state::ModelkitAppState;
use axum::extract::{Path, Query, State};
use axum::response::Response;
use axum::Json;
use sdkwork_modelkit_catalog_service::domain::CatalogListQuery;
use sdkwork_modelkit_catalog_service::CatalogRepository;
use sdkwork_modelkit_preferences_service::PreferenceRepository;
use sdkwork_routes_modelkit_http_auth::{
    authenticated_actor, finish_api_json, finish_created_json, map_catalog_error, map_product_error,
    ApiResult,
};
use sdkwork_web_core::WebRequestContext;

pub async fn get_preference<P, C>(
    State(state): State<ModelkitAppState<P, C>>,
    app_ctx: WebRequestContext,
    Path(namespace): Path<String>,
) -> Response
where
    P: PreferenceRepository + Clone + 'static,
    C: CatalogRepository + Clone + 'static,
{
    let result: ApiResult<_> = async {
        let context = authenticated_actor(&app_ctx, "modelkit.preferences.read")?;
        let entry = state
            .preferences
            .get_preference(context, namespace.clone())
            .await
            .map_err(map_product_error)?;
        Ok(resource_data(PreferenceResponse {
            namespace: entry.namespace,
            payload: entry.payload,
            version: entry.version,
        }))
    }
    .await;
    finish_api_json(&app_ctx, result)
}

pub async fn put_preference<P, C>(
    State(state): State<ModelkitAppState<P, C>>,
    app_ctx: WebRequestContext,
    Path(namespace): Path<String>,
    Json(payload): Json<PutPreferenceRequest>,
) -> Response
where
    P: PreferenceRepository + Clone + 'static,
    C: CatalogRepository + Clone + 'static,
{
    let result: ApiResult<_> = async {
        let context = authenticated_actor(&app_ctx, "modelkit.preferences.write")?;
        let entry = state
            .preferences
            .put_preference(context, namespace.clone(), payload.payload)
            .await
            .map_err(map_product_error)?;
        Ok(resource_data(PreferenceResponse {
            namespace: entry.namespace,
            payload: entry.payload,
            version: entry.version,
        }))
    }
    .await;
    finish_created_json(&app_ctx, result)
}

pub async fn list_catalog_items<P, C>(
    State(state): State<ModelkitAppState<P, C>>,
    app_ctx: WebRequestContext,
    Path(domain): Path<String>,
    Query(query): Query<CatalogListQueryParams>,
) -> Response
where
    P: PreferenceRepository + Clone + 'static,
    C: CatalogRepository + Clone + 'static,
{
    let result: ApiResult<_> = async {
        let _context = authenticated_actor(&app_ctx, "modelkit.catalog.read")?;
        let limit = query.page_size.unwrap_or(20);
        let offset = query.offset.unwrap_or(0);
        let page = state
            .catalog
            .list_items(
                domain,
                CatalogListQuery {
                    category: query.category,
                    q: query.q,
                    offset,
                    limit,
                },
            )
            .await
            .map_err(map_catalog_error)?;
        let items = page
            .items
            .into_iter()
            .map(|item| CatalogItemResponse {
                item_id: item.item_id,
                domain: item.domain,
                category: item.category,
                payload: item.payload,
                drive_object_ref: item.drive_object_ref,
                version: item.version,
            })
            .collect();
        Ok(list_page(items, page.total_items, offset, limit))
    }
    .await;
    finish_api_json(&app_ctx, result)
}

pub async fn get_catalog_item<P, C>(
    State(state): State<ModelkitAppState<P, C>>,
    app_ctx: WebRequestContext,
    Path((domain, item_id)): Path<(String, String)>,
) -> Response
where
    P: PreferenceRepository + Clone + 'static,
    C: CatalogRepository + Clone + 'static,
{
    let result: ApiResult<_> = async {
        let _context = authenticated_actor(&app_ctx, "modelkit.catalog.read")?;
        let item = state
            .catalog
            .get_item(domain, item_id)
            .await
            .map_err(map_catalog_error)?;
        Ok(resource_data(CatalogItemResponse {
            item_id: item.item_id,
            domain: item.domain,
            category: item.category,
            payload: item.payload,
            drive_object_ref: item.drive_object_ref,
            version: item.version,
        }))
    }
    .await;
    finish_api_json(&app_ctx, result)
}

pub async fn create_catalog_item<P, C>(
    State(state): State<ModelkitAppState<P, C>>,
    app_ctx: WebRequestContext,
    Path(domain): Path<String>,
    Json(payload): Json<CreateCatalogItemRequest>,
) -> Response
where
    P: PreferenceRepository + Clone + 'static,
    C: CatalogRepository + Clone + 'static,
{
    let result: ApiResult<_> = async {
        let context = authenticated_actor(&app_ctx, "modelkit.catalog.write")?;
        let item = state
            .catalog
            .create_item(
                context,
                domain,
                payload.category,
                payload.payload,
                payload.drive_object_ref,
            )
            .await
            .map_err(map_catalog_error)?;
        Ok(resource_data(CatalogItemResponse {
            item_id: item.item_id,
            domain: item.domain,
            category: item.category,
            payload: item.payload,
            drive_object_ref: item.drive_object_ref,
            version: item.version,
        }))
    }
    .await;
    finish_created_json(&app_ctx, result)
}

pub async fn patch_catalog_item<P, C>(
    State(state): State<ModelkitAppState<P, C>>,
    app_ctx: WebRequestContext,
    Path((domain, item_id)): Path<(String, String)>,
    Json(payload): Json<PatchCatalogItemRequest>,
) -> Response
where
    P: PreferenceRepository + Clone + 'static,
    C: CatalogRepository + Clone + 'static,
{
    let result: ApiResult<_> = async {
        let context = authenticated_actor(&app_ctx, "modelkit.catalog.write")?;
        let item = state
            .catalog
            .patch_item(context, domain, item_id, payload.payload)
            .await
            .map_err(map_catalog_error)?;
        Ok(resource_data(CatalogItemResponse {
            item_id: item.item_id,
            domain: item.domain,
            category: item.category,
            payload: item.payload,
            drive_object_ref: item.drive_object_ref,
            version: item.version,
        }))
    }
    .await;
    finish_api_json(&app_ctx, result)
}

pub async fn list_catalog_categories<P, C>(
    State(state): State<ModelkitAppState<P, C>>,
    app_ctx: WebRequestContext,
    Path(domain): Path<String>,
) -> Response
where
    P: PreferenceRepository + Clone + 'static,
    C: CatalogRepository + Clone + 'static,
{
    let result: ApiResult<_> = async {
        let _context = authenticated_actor(&app_ctx, "modelkit.catalog.read")?;
        let categories = state
            .catalog
            .list_categories(domain)
            .await
            .map_err(map_catalog_error)?;
        Ok(resource_data(serde_json::json!({ "categories": categories })))
    }
    .await;
    finish_api_json(&app_ctx, result)
}
