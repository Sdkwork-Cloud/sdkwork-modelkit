use sdkwork_modelkit_catalog_service::CatalogService;
use sdkwork_modelkit_preferences_service::PreferencesService;

#[derive(Clone)]
pub struct ModelkitAppState<P, C>
where
    P: sdkwork_modelkit_preferences_service::PreferenceRepository,
    C: sdkwork_modelkit_catalog_service::CatalogRepository,
{
    pub preferences: PreferencesService<P>,
    pub catalog: CatalogService<C>,
}

impl<P, C> ModelkitAppState<P, C>
where
    P: sdkwork_modelkit_preferences_service::PreferenceRepository,
    C: sdkwork_modelkit_catalog_service::CatalogRepository,
{
    pub fn new(preferences: PreferencesService<P>, catalog: CatalogService<C>) -> Self {
        Self {
            preferences,
            catalog,
        }
    }
}
