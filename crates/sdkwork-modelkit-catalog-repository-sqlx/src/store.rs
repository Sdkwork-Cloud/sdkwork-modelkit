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
        let category = if category.eq_ignore_ascii_case("all") {
            ""
        } else {
            category
        };
        let search = query.q.as_deref().unwrap_or("").trim().to_lowercase();
        let search_pattern = if search.is_empty() {
            String::new()
        } else {
            format!("%{search}%")
        };

        let total_items = sqlx::query_scalar::<_, i64>(
            r#"
            SELECT COUNT(*)
            FROM mk_catalog_item
            WHERE domain = $1
              AND ($2 = '' OR LOWER(category) = LOWER($2))
              AND ($3 = '' OR LOWER(payload) LIKE $3)
            "#,
        )
        .bind(domain)
        .bind(category)
        .bind(&search_pattern)
        .fetch_one(&self.pool)
        .await
        .map_err(|error| CatalogProductError::Internal(error.to_string()))?;

        let items = sqlx::query_as::<_, CatalogRow>(
            r#"
            SELECT item_id, domain, category, payload, drive_object_ref,
                   CAST(version AS BIGINT) AS version
            FROM mk_catalog_item
            WHERE domain = $1
              AND ($2 = '' OR LOWER(category) = LOWER($2))
              AND ($3 = '' OR LOWER(payload) LIKE $3)
            ORDER BY updated_at DESC
            LIMIT $4 OFFSET $5
            "#,
        )
        .bind(domain)
        .bind(category)
        .bind(&search_pattern)
        .bind(query.limit)
        .bind(query.offset)
        .fetch_all(&self.pool)
        .await
        .map_err(|error| CatalogProductError::Internal(error.to_string()))?;

        let page = items
            .into_iter()
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
            SELECT item_id, domain, category, payload, drive_object_ref,
                   CAST(version AS BIGINT) AS version
            FROM mk_catalog_item
            WHERE domain = $1 AND item_id = $2
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
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
            SET payload = $1, version = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP
            WHERE domain = $4 AND item_id = $5
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
            WHERE domain = $1
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

#[cfg(test)]
mod tests {
    use super::*;
    use sdkwork_modelkit_catalog_service::ports::CatalogRepository;
    use sqlx::any::AnyPoolOptions;

    async fn sqlite_store() -> SqlCatalogStore {
        sqlx::any::install_default_drivers();
        let pool = AnyPoolOptions::new()
            .max_connections(1)
            .connect("sqlite::memory:")
            .await
            .expect("connect in-memory SQLite");
        crate::schema::install_schema(&pool)
            .await
            .expect("install catalog schema");
        SqlCatalogStore::new(pool)
    }

    #[tokio::test]
    async fn numbered_bindings_support_catalog_crud_and_store_level_pagination() {
        let store = sqlite_store().await;
        let context = CatalogActorContext {
            tenant_id: "tenant-test".to_string(),
            organization_id: "organization-test".to_string(),
            subject_type: "user".to_string(),
            subject_id: "subject-test".to_string(),
            operator_id: "operator-test".to_string(),
        };

        let created = store
            .create_item(
                &context,
                "shop",
                "keys",
                serde_json::json!({"name": "Unique test license"}),
                None,
            )
            .await
            .expect("create catalog item");

        let result = store
            .list_items(
                "shop",
                &CatalogListQuery {
                    category: Some("keys".to_string()),
                    q: Some("unique test".to_string()),
                    offset: 0,
                    limit: 1,
                },
            )
            .await
            .expect("list catalog items");
        assert_eq!(result.total_items, 1);
        assert_eq!(result.items.len(), 1);
        assert_eq!(result.items[0].item_id, created.item_id);

        let patched = store
            .patch_item(
                &context,
                "shop",
                &created.item_id,
                serde_json::json!({"name": "Updated test license"}),
            )
            .await
            .expect("patch catalog item");
        assert_eq!(patched.version, 2);

        let categories = store
            .list_categories("shop")
            .await
            .expect("list catalog categories");
        assert!(categories.iter().any(|category| category == "keys"));
    }
}
