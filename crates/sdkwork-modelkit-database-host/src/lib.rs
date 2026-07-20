use std::path::PathBuf;
use std::sync::Arc;

use sdkwork_database_config::DatabaseConfig;
use sdkwork_database_lifecycle::{lifecycle_options_from_env, LifecycleOrchestrator};
use sdkwork_database_spi::{DatabaseAssetProvider, DatabaseManifest, DefaultDatabaseModule};
use sdkwork_database_sqlx::{create_any_pool_from_config, create_pool_from_config, DatabasePool};
use sdkwork_modelkit_catalog_repository_sqlx::schema::install_schema as install_catalog_schema;
use sdkwork_modelkit_catalog_repository_sqlx::SqlCatalogStore;
use sdkwork_modelkit_catalog_service::CatalogService;
use sdkwork_modelkit_preferences_repository_sqlx::schema::install_schema as install_preference_schema;
use sdkwork_modelkit_preferences_repository_sqlx::SqlPreferenceStore;
use sdkwork_modelkit_preferences_service::PreferencesService;

pub struct ModelkitDatabaseHost {
    pool: DatabasePool,
    module: Arc<DefaultDatabaseModule>,
}

impl ModelkitDatabaseHost {
    pub fn pool(&self) -> &DatabasePool {
        &self.pool
    }

    pub fn module(&self) -> Arc<DefaultDatabaseModule> {
        self.module.clone()
    }
}

#[derive(Clone)]
pub struct ModelkitApplicationServices {
    pub preferences: PreferencesService<SqlPreferenceStore>,
    pub catalog: CatalogService<SqlCatalogStore>,
}

pub async fn bootstrap_modelkit_database(
    pool: DatabasePool,
) -> Result<ModelkitDatabaseHost, String> {
    let module = Arc::new(
        DefaultDatabaseModule::from_app_root(resolve_app_root())
            .map_err(|error| format!("load modelkit database module failed: {error}"))?,
    );
    let manifest = DatabaseManifest::from_file(module.manifest_path())
        .map_err(|error| format!("read modelkit database manifest failed: {error}"))?;
    let options = lifecycle_options_from_env("MODELKIT", &manifest);
    let orchestrator = LifecycleOrchestrator::new(pool.clone(), module.clone())
        .with_applied_by("sdkwork-modelkit");

    orchestrator
        .init()
        .await
        .map_err(|error| format!("modelkit database init failed: {error}"))?;
    if options.auto_migrate {
        orchestrator
            .migrate()
            .await
            .map_err(|error| format!("modelkit database migrate failed: {error}"))?;
    }
    if options.seed_on_boot {
        orchestrator
            .seed(&options.seed_locale, &options.seed_profile)
            .await
            .map_err(|error| format!("modelkit database seed failed: {error}"))?;
    }

    Ok(ModelkitDatabaseHost { pool, module })
}

pub async fn bootstrap_modelkit_database_from_env() -> Result<ModelkitDatabaseHost, String> {
    let config = database_config_from_env()?;
    let pool = create_pool_from_config(config)
        .await
        .map_err(|error| format!("create modelkit database pool failed: {error}"))?;
    bootstrap_modelkit_database(pool).await
}

pub async fn build_application_services() -> Result<ModelkitApplicationServices, String> {
    bootstrap_modelkit_database_from_env().await?;

    sqlx::any::install_default_drivers();
    let pool = create_any_pool_from_config(database_config_from_env()?)
        .await
        .map_err(|error| format!("connect modelkit database failed: {error}"))?;

    install_preference_schema(&pool)
        .await
        .map_err(|error| format!("install modelkit preference schema failed: {error}"))?;
    install_catalog_schema(&pool)
        .await
        .map_err(|error| format!("install modelkit catalog schema failed: {error}"))?;

    let preference_store = SqlPreferenceStore::new(pool.clone());
    let catalog_store = SqlCatalogStore::new(pool);

    Ok(ModelkitApplicationServices {
        preferences: PreferencesService::new(preference_store),
        catalog: CatalogService::new(catalog_store),
    })
}

pub async fn build_preferences_service() -> Result<PreferencesService<SqlPreferenceStore>, String> {
    Ok(build_application_services().await?.preferences)
}

fn database_config_from_env() -> Result<DatabaseConfig, String> {
    DatabaseConfig::from_env("MODELKIT")
        .map_err(|error| format!("resolve modelkit database config failed: {error}"))
}

fn resolve_app_root() -> PathBuf {
    std::env::var("SDKWORK_MODELKIT_APP_ROOT")
        .map(PathBuf::from)
        .unwrap_or_else(|_| {
            PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                .join("../..")
                .canonicalize()
                .unwrap_or_else(|_| PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../.."))
        })
}

#[cfg(test)]
mod tests {
    use sdkwork_database_config::{DatabaseConfig, DatabaseEngine};
    use sdkwork_database_sqlx::{create_pool_from_config, DatabasePool};

    use super::bootstrap_modelkit_database;

    #[tokio::test]
    async fn lifecycle_bootstrap_materializes_modelkit_baseline_and_history() {
        let pool = create_pool_from_config(DatabaseConfig {
            engine: DatabaseEngine::Sqlite,
            url: "sqlite::memory:".to_owned(),
            max_connections: 1,
            ..DatabaseConfig::default()
        })
        .await
        .expect("create modelkit test pool");

        bootstrap_modelkit_database(pool.clone())
            .await
            .expect("bootstrap modelkit database");

        let DatabasePool::Sqlite(sqlite, _) = pool else {
            panic!("expected sqlite pool");
        };
        for table in [
            "mk_preference_entry",
            "mk_catalog_item",
            "ops_database_installation_state",
        ] {
            let count: i64 = sqlx::query_scalar(
                "SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name = ?",
            )
            .bind(table)
            .fetch_one(&sqlite)
            .await
            .expect("inspect modelkit test schema");
            assert_eq!(count, 1, "missing table {table}");
        }
    }
}
