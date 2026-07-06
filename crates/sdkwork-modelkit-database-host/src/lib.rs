use sdkwork_modelkit_catalog_repository_sqlx::schema::install_schema as install_catalog_schema;
use sdkwork_modelkit_catalog_repository_sqlx::SqlCatalogStore;
use sdkwork_modelkit_catalog_service::CatalogService;
use sdkwork_modelkit_preferences_repository_sqlx::schema::install_schema as install_preference_schema;
use sdkwork_modelkit_preferences_repository_sqlx::SqlPreferenceStore;
use sdkwork_modelkit_preferences_service::PreferencesService;
use sdkwork_database_config::DatabaseConfig;
use sqlx::any::AnyPoolOptions;

#[derive(Clone)]
pub struct ModelkitApplicationServices {
    pub preferences: PreferencesService<SqlPreferenceStore>,
    pub catalog: CatalogService<SqlCatalogStore>,
}

pub async fn build_application_services() -> Result<ModelkitApplicationServices, String> {
    sqlx::any::install_default_drivers();
    let config = DatabaseConfig::from_env("modelkit")
        .map_err(|error| format!("resolve modelkit database config failed: {error}"))?;
    let pool = AnyPoolOptions::new()
        .max_connections(config.max_connections)
        .min_connections(config.min_connections)
        .acquire_timeout(config.acquire_timeout())
        .idle_timeout(config.idle_timeout())
        .max_lifetime(config.max_lifetime())
        .connect(&config.url)
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

pub async fn build_preferences_service(
) -> Result<PreferencesService<SqlPreferenceStore>, String> {
    Ok(build_application_services().await?.preferences)
}
