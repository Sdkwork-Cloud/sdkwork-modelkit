#[derive(Debug, Clone)]
pub enum CatalogProductError {
    Validation(String),
    NotFound(String),
    Internal(String),
}

impl CatalogProductError {
    pub fn validation(message: impl Into<String>) -> Self {
        Self::Validation(message.into())
    }

    pub fn not_found(message: impl Into<String>) -> Self {
        Self::NotFound(message.into())
    }
}
