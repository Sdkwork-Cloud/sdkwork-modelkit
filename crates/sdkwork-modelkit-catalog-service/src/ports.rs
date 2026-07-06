use async_trait::async_trait;

use crate::domain::{CatalogActorContext, CatalogItem, CatalogListQuery, CatalogListResult};
use crate::error::CatalogProductError;

#[async_trait]
pub trait CatalogRepository: Send + Sync {
    async fn list_items(
        &self,
        domain: &str,
        query: &CatalogListQuery,
    ) -> Result<CatalogListResult, CatalogProductError>;

    async fn get_item(
        &self,
        domain: &str,
        item_id: &str,
    ) -> Result<Option<CatalogItem>, CatalogProductError>;

    async fn create_item(
        &self,
        context: &CatalogActorContext,
        domain: &str,
        category: &str,
        payload: serde_json::Value,
        drive_object_ref: Option<String>,
    ) -> Result<CatalogItem, CatalogProductError>;

    async fn patch_item(
        &self,
        context: &CatalogActorContext,
        domain: &str,
        item_id: &str,
        payload: serde_json::Value,
    ) -> Result<CatalogItem, CatalogProductError>;

    async fn list_categories(&self, domain: &str) -> Result<Vec<String>, CatalogProductError>;
}
