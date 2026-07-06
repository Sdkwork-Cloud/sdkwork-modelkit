use thiserror::Error;

#[derive(Debug, Error)]
pub enum PreferencesProductError {
    #[error("{0}")]
    Validation(String),
    #[error("{0}")]
    NotFound(String),
    #[error("{0}")]
    PermissionDenied(String),
    #[error("{0}")]
    Internal(String),
}
