use async_trait::async_trait;
use sdkwork_modelkit_preferences_service::domain::{ModelkitActorContext, PreferenceEntry};
use sdkwork_modelkit_preferences_service::error::PreferencesProductError;
use sdkwork_modelkit_preferences_service::ports::PreferenceRepository;
use sqlx::{AnyPool, FromRow};

#[derive(FromRow)]
struct PreferenceRow {
    payload: String,
    version: i64,
}

pub struct SqlPreferenceStore {
    pool: AnyPool,
}

impl Clone for SqlPreferenceStore {
    fn clone(&self) -> Self {
        Self {
            pool: self.pool.clone(),
        }
    }
}

impl SqlPreferenceStore {
    pub fn new(pool: AnyPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl PreferenceRepository for SqlPreferenceStore {
    async fn get_preference(
        &self,
        context: &ModelkitActorContext,
        namespace: &str,
    ) -> Result<Option<PreferenceEntry>, PreferencesProductError> {
        let row = sqlx::query_as::<_, PreferenceRow>(
            r#"
            SELECT payload, version
            FROM mk_preference_entry
            WHERE tenant_id = ? AND organization_id = ? AND subject_type = ? AND subject_id = ? AND namespace = ?
            "#,
        )
        .bind(&context.tenant_id)
        .bind(&context.organization_id)
        .bind(&context.subject_type)
        .bind(&context.subject_id)
        .bind(namespace)
        .fetch_optional(&self.pool)
        .await
        .map_err(|error| PreferencesProductError::Internal(error.to_string()))?;

        Ok(row.map(|row| PreferenceEntry {
            namespace: namespace.to_string(),
            payload: serde_json::from_str(&row.payload).unwrap_or(serde_json::Value::Null),
            version: row.version,
        }))
    }

    async fn put_preference(
        &self,
        context: &ModelkitActorContext,
        namespace: &str,
        payload: serde_json::Value,
    ) -> Result<PreferenceEntry, PreferencesProductError> {
        let payload_text = serde_json::to_string(&payload)
            .map_err(|error| PreferencesProductError::Validation(error.to_string()))?;

        let existing = self.get_preference(context, namespace).await?;
        let next_version = existing.map(|entry| entry.version + 1).unwrap_or(1);

        sqlx::query(
            r#"
            INSERT INTO mk_preference_entry (
                tenant_id, organization_id, subject_type, subject_id, namespace,
                payload, version, created_by, updated_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(tenant_id, organization_id, subject_type, subject_id, namespace)
            DO UPDATE SET
                payload = excluded.payload,
                version = excluded.version,
                updated_by = excluded.updated_by,
                updated_at = CURRENT_TIMESTAMP
            "#,
        )
        .bind(&context.tenant_id)
        .bind(&context.organization_id)
        .bind(&context.subject_type)
        .bind(&context.subject_id)
        .bind(namespace)
        .bind(&payload_text)
        .bind(next_version)
        .bind(&context.operator_id)
        .bind(&context.operator_id)
        .execute(&self.pool)
        .await
        .map_err(|error| PreferencesProductError::Internal(error.to_string()))?;

        Ok(PreferenceEntry {
            namespace: namespace.to_string(),
            payload,
            version: next_version,
        })
    }
}
