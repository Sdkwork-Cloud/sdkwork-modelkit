//! Modelkit drive adapter boundary. Business crates depend on this port, not sdkwork-drive internals.

use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DriveObjectRef {
    pub space_id: String,
    pub node_id: String,
    pub version_id: String,
    pub uri: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PresignUploadRequest {
    pub filename: String,
    pub content_type: String,
    pub size_bytes: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PresignUploadResponse {
    pub upload_url: String,
    pub object_ref: DriveObjectRef,
}

#[derive(Debug, Error)]
pub enum ModelkitDriveError {
    #[error("{0}")]
    Validation(String),
    #[error("{0}")]
    Internal(String),
}

#[async_trait]
pub trait ModelkitArtifactStorage: Send + Sync {
    async fn presign_upload(
        &self,
        request: PresignUploadRequest,
    ) -> Result<PresignUploadResponse, ModelkitDriveError>;

    async fn confirm_upload(
        &self,
        object_ref: DriveObjectRef,
    ) -> Result<DriveObjectRef, ModelkitDriveError>;
}

pub struct UnconfiguredDriveAdapter;

#[async_trait]
impl ModelkitArtifactStorage for UnconfiguredDriveAdapter {
    async fn presign_upload(
        &self,
        _request: PresignUploadRequest,
    ) -> Result<PresignUploadResponse, ModelkitDriveError> {
        Err(ModelkitDriveError::Internal(
            "sdkwork-drive adapter is not configured; set drive workspace env before upload"
                .to_string(),
        ))
    }

    async fn confirm_upload(
        &self,
        _object_ref: DriveObjectRef,
    ) -> Result<DriveObjectRef, ModelkitDriveError> {
        Err(ModelkitDriveError::Internal(
            "sdkwork-drive adapter is not configured; set drive workspace env before upload"
                .to_string(),
        ))
    }
}
