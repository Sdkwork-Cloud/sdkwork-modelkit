use async_trait::async_trait;

use crate::domain::{ModelkitActorContext, PreferenceEntry};
use crate::error::PreferencesProductError;

#[async_trait]
pub trait PreferenceRepository: Send + Sync + Clone {
    async fn get_preference(
        &self,
        context: &ModelkitActorContext,
        namespace: &str,
    ) -> Result<Option<PreferenceEntry>, PreferencesProductError>;

    async fn put_preference(
        &self,
        context: &ModelkitActorContext,
        namespace: &str,
        payload: serde_json::Value,
    ) -> Result<PreferenceEntry, PreferencesProductError>;
}
