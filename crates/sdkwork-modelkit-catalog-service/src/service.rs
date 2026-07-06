use crate::domain::{CatalogActorContext, CatalogDomain, CatalogItem, CatalogListQuery, CatalogListResult};
use crate::error::CatalogProductError;
use crate::ports::CatalogRepository;

#[derive(Clone)]
pub struct CatalogService<R>
where
    R: CatalogRepository,
{
    repository: R,
}

impl<R> CatalogService<R>
where
    R: CatalogRepository,
{
    pub fn new(repository: R) -> Self {
        Self { repository }
    }

    pub async fn list_items(
        &self,
        domain: String,
        query: CatalogListQuery,
    ) -> Result<CatalogListResult, CatalogProductError> {
        validate_domain(&domain)?;
        let limit = query.limit.clamp(1, 200);
        let offset = query.offset.max(0);
        let mut normalized = query;
        normalized.limit = limit;
        normalized.offset = offset;
        self.repository.list_items(&domain, &normalized).await
    }

    pub async fn get_item(
        &self,
        domain: String,
        item_id: String,
    ) -> Result<CatalogItem, CatalogProductError> {
        validate_domain(&domain)?;
        self.repository
            .get_item(&domain, &item_id)
            .await?
            .ok_or_else(|| CatalogProductError::not_found("Catalog item was not found."))
    }

    pub async fn create_item(
        &self,
        context: CatalogActorContext,
        domain: String,
        category: String,
        payload: serde_json::Value,
        drive_object_ref: Option<String>,
    ) -> Result<CatalogItem, CatalogProductError> {
        validate_domain(&domain)?;
        if category.trim().is_empty() {
            return Err(CatalogProductError::validation("category is required"));
        }
        if payload.is_null() {
            return Err(CatalogProductError::validation("payload is required"));
        }
        self.repository
            .create_item(&context, &domain, category.trim(), payload, drive_object_ref)
            .await
    }

    pub async fn patch_item(
        &self,
        context: CatalogActorContext,
        domain: String,
        item_id: String,
        payload: serde_json::Value,
    ) -> Result<CatalogItem, CatalogProductError> {
        validate_domain(&domain)?;
        if payload.is_null() {
            return Err(CatalogProductError::validation("payload is required"));
        }
        self.repository
            .patch_item(&context, &domain, &item_id, payload)
            .await
    }

    pub async fn list_categories(&self, domain: String) -> Result<Vec<String>, CatalogProductError> {
        validate_domain(&domain)?;
        let mut categories = self.repository.list_categories(&domain).await?;
        for default in CatalogDomain::default_categories(&domain) {
            if !categories.iter().any(|value| value == default) {
                categories.push((*default).to_string());
            }
        }
        Ok(categories)
    }
}

fn validate_domain(domain: &str) -> Result<(), CatalogProductError> {
    if CatalogDomain::is_allowed(domain) {
        Ok(())
    } else {
        Err(CatalogProductError::validation(format!(
            "unsupported catalog domain: {domain}"
        )))
    }
}
