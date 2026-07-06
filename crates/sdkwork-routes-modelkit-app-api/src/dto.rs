use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PreferenceResponse {
    pub namespace: String,
    pub payload: serde_json::Value,
    pub version: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PutPreferenceRequest {
    pub payload: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CatalogItemResponse {
    pub item_id: String,
    pub domain: String,
    pub category: String,
    pub payload: serde_json::Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub drive_object_ref: Option<String>,
    pub version: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateCatalogItemRequest {
    pub category: String,
    pub payload: serde_json::Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub drive_object_ref: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PatchCatalogItemRequest {
    pub payload: serde_json::Value,
}

#[derive(Debug, Clone, Deserialize)]
pub struct CatalogListQueryParams {
    pub category: Option<String>,
    pub q: Option<String>,
    pub offset: Option<i64>,
    pub limit: Option<i64>,
}
