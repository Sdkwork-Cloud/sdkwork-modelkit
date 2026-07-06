use sqlx::AnyPool;

pub async fn install_schema(pool: &AnyPool) -> Result<(), String> {
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS mk_catalog_item (
            item_id TEXT PRIMARY KEY,
            domain TEXT NOT NULL,
            category TEXT NOT NULL,
            payload TEXT NOT NULL,
            drive_object_ref TEXT,
            tenant_id TEXT NOT NULL,
            organization_id TEXT NOT NULL DEFAULT '0',
            created_by TEXT NOT NULL,
            updated_by TEXT NOT NULL,
            version INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CHECK (length(trim(domain)) BETWEEN 1 AND 64),
            CHECK (length(trim(category)) BETWEEN 1 AND 128),
            CHECK (version >= 1)
        )
        "#,
    )
    .execute(pool)
    .await
    .map_err(|error| error.to_string())?;

    sqlx::query(
        r#"
        CREATE INDEX IF NOT EXISTS ix_mk_catalog_item_domain_category
        ON mk_catalog_item (domain, category)
        "#,
    )
    .execute(pool)
    .await
    .map_err(|error| error.to_string())?;

    crate::seed::seed_default_catalog(pool).await
}
