use async_trait::async_trait;
use sdkwork_modelkit_catalog_service::domain::{
    CatalogActorContext, CatalogItem, CatalogListQuery, CatalogListResult,
};
use sdkwork_modelkit_catalog_service::error::CatalogProductError;
use sdkwork_modelkit_catalog_service::ports::CatalogRepository;
use sqlx::{AnyPool, FromRow};
use uuid::Uuid;

#[derive(FromRow)]
struct CatalogRow {
    item_id: String,
    domain: String,
    category: String,
    payload: String,
    drive_object_ref: Option<String>,
    version: i64,
}

pub struct SqlCatalogStore {
    pool: AnyPool,
}

impl Clone for SqlCatalogStore {
    fn clone(&self) -> Self {
        Self {
            pool: self.pool.clone(),
        }
    }
}

impl SqlCatalogStore {
    pub fn new(pool: AnyPool) -> Self {
        Self { pool }
    }

    fn map_row(row: CatalogRow) -> Result<CatalogItem, CatalogProductError> {
        Ok(CatalogItem {
            item_id: row.item_id,
            domain: row.domain,
            category: row.category,
            payload: serde_json::from_str(&row.payload)
                .map_err(|error| CatalogProductError::Internal(error.to_string()))?,
            drive_object_ref: row.drive_object_ref,
            version: row.version,
        })
    }
}

#[async_trait]
impl CatalogRepository for SqlCatalogStore {
    async fn list_items(
        &self,
        domain: &str,
        query: &CatalogListQuery,
    ) -> Result<CatalogListResult, CatalogProductError> {
        let category = query.category.as_deref().unwrap_or("").trim();
        let search = query.q.as_deref().unwrap_or("").trim().to_lowercase();

        let mut items = sqlx::query_as::<_, CatalogRow>(
            r#"
            SELECT item_id, domain, category, payload, drive_object_ref, version
            FROM mk_catalog_item
            WHERE domain = ?
            ORDER BY updated_at DESC
            "#,
        )
        .bind(domain)
        .fetch_all(&self.pool)
        .await
        .map_err(|error| CatalogProductError::Internal(error.to_string()))?;

        if !category.is_empty() && category != "All" && category != "all" {
            items.retain(|row| row.category == category);
        }

        if !search.is_empty() {
            items.retain(|row| row.payload.to_lowercase().contains(&search));
        }

        let total_items = items.len() as i64;
        let offset = query.offset as usize;
        let limit = query.limit as usize;
        let page = items
            .into_iter()
            .skip(offset)
            .take(limit)
            .map(Self::map_row)
            .collect::<Result<Vec<_>, _>>()?;

        Ok(CatalogListResult {
            items: page,
            total_items,
        })
    }

    async fn get_item(
        &self,
        domain: &str,
        item_id: &str,
    ) -> Result<Option<CatalogItem>, CatalogProductError> {
        let row = sqlx::query_as::<_, CatalogRow>(
            r#"
            SELECT item_id, domain, category, payload, drive_object_ref, version
            FROM mk_catalog_item
            WHERE domain = ? AND item_id = ?
            "#,
        )
        .bind(domain)
        .bind(item_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|error| CatalogProductError::Internal(error.to_string()))?;

        row.map(Self::map_row).transpose()
    }

    async fn create_item(
        &self,
        context: &CatalogActorContext,
        domain: &str,
        category: &str,
        payload: serde_json::Value,
        drive_object_ref: Option<String>,
    ) -> Result<CatalogItem, CatalogProductError> {
        let item_id = Uuid::new_v4().to_string();
        let payload_text = serde_json::to_string(&payload)
            .map_err(|error| CatalogProductError::Validation(error.to_string()))?;

        sqlx::query(
            r#"
            INSERT INTO mk_catalog_item (
                item_id, domain, category, payload, drive_object_ref,
                tenant_id, organization_id, created_by, updated_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&item_id)
        .bind(domain)
        .bind(category)
        .bind(&payload_text)
        .bind(&drive_object_ref)
        .bind(&context.tenant_id)
        .bind(&context.organization_id)
        .bind(&context.operator_id)
        .bind(&context.operator_id)
        .execute(&self.pool)
        .await
        .map_err(|error| CatalogProductError::Internal(error.to_string()))?;

        Ok(CatalogItem {
            item_id,
            domain: domain.to_string(),
            category: category.to_string(),
            payload,
            drive_object_ref,
            version: 1,
        })
    }

    async fn patch_item(
        &self,
        context: &CatalogActorContext,
        domain: &str,
        item_id: &str,
        payload: serde_json::Value,
    ) -> Result<CatalogItem, CatalogProductError> {
        let existing = self
            .get_item(domain, item_id)
            .await?
            .ok_or_else(|| CatalogProductError::not_found("Catalog item was not found."))?;

        let payload_text = serde_json::to_string(&payload)
            .map_err(|error| CatalogProductError::Validation(error.to_string()))?;
        let next_version = existing.version + 1;

        sqlx::query(
            r#"
            UPDATE mk_catalog_item
            SET payload = ?, version = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
            WHERE domain = ? AND item_id = ?
            "#,
        )
        .bind(&payload_text)
        .bind(next_version)
        .bind(&context.operator_id)
        .bind(domain)
        .bind(item_id)
        .execute(&self.pool)
        .await
        .map_err(|error| CatalogProductError::Internal(error.to_string()))?;

        Ok(CatalogItem {
            item_id: existing.item_id,
            domain: existing.domain,
            category: existing.category,
            payload,
            drive_object_ref: existing.drive_object_ref,
            version: next_version,
        })
    }

    async fn list_categories(&self, domain: &str) -> Result<Vec<String>, CatalogProductError> {
        let rows = sqlx::query_scalar::<_, String>(
            r#"
            SELECT DISTINCT category
            FROM mk_catalog_item
            WHERE domain = ?
            ORDER BY category ASC
            "#,
        )
        .bind(domain)
        .fetch_all(&self.pool)
        .await
        .map_err(|error| CatalogProductError::Internal(error.to_string()))?;

        Ok(rows)
    }
}
