use crate::domain::{ModelkitActorContext, PreferenceEntry, PreferenceNamespace};
use crate::error::PreferencesProductError;
use crate::ports::PreferenceRepository;

pub struct PreferencesService<R>
where
    R: PreferenceRepository,
{
    repository: R,
}

impl<R> Clone for PreferencesService<R>
where
    R: PreferenceRepository + Clone,
{
    fn clone(&self) -> Self {
        Self {
            repository: self.repository.clone(),
        }
    }
}

impl<R> PreferencesService<R>
where
    R: PreferenceRepository,
{
    pub fn new(repository: R) -> Self {
        Self { repository }
    }

    pub async fn get_preference(
        &self,
        context: ModelkitActorContext,
        namespace: String,
    ) -> Result<PreferenceEntry, PreferencesProductError> {
        if !PreferenceNamespace::is_allowed(&namespace) {
            return Err(PreferencesProductError::Validation(format!(
                "unsupported preference namespace: {namespace}"
            )));
        }
        self.repository
            .get_preference(&context, &namespace)
            .await?
            .ok_or_else(|| {
                PreferencesProductError::NotFound(format!("preference not found: {namespace}"))
            })
    }

    pub async fn put_preference(
        &self,
        context: ModelkitActorContext,
        namespace: String,
        payload: serde_json::Value,
    ) -> Result<PreferenceEntry, PreferencesProductError> {
        if !PreferenceNamespace::is_allowed(&namespace) {
            return Err(PreferencesProductError::Validation(format!(
                "unsupported preference namespace: {namespace}"
            )));
        }
        self.repository
            .put_preference(&context, &namespace, payload)
            .await
    }
}
