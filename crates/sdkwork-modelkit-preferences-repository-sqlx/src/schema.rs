use sqlx::AnyPool;
use std::path::Path;

const BASELINE_SQLITE: &str = include_str!("../../../database/ddl/baseline/sqlite/0001_modelkit_baseline.sql");

pub async fn install_schema(pool: &AnyPool) -> Result<(), sqlx::Error> {
    for statement in BASELINE_SQLITE.split(';') {
        let trimmed = statement.trim();
        if trimmed.is_empty() {
            continue;
        }
        sqlx::query(trimmed).execute(pool).await?;
    }
    Ok(())
}

pub async fn install_schema_from_baseline(pool: &AnyPool, _baseline: &Path) -> Result<(), sqlx::Error> {
    install_schema(pool).await
}
