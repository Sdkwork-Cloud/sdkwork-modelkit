use axum::http::StatusCode;
use sdkwork_utils_rust::string::trim;
use sdkwork_web_core::WebRequestContext;

#[derive(Debug, Clone)]
pub struct AuthProblem {
    pub code: String,
    pub detail: String,
    pub status: StatusCode,
}

pub fn actor_context_from_web_request(
    app_ctx: &WebRequestContext,
) -> Result<sdkwork_modelkit_preferences_service::ModelkitActorContext, AuthProblem> {
    let principal = app_ctx.principal.as_ref().ok_or_else(|| AuthProblem {
        code: "modelkit.auth.missing_principal".to_string(),
        detail: "authenticated request context is required".to_string(),
        status: StatusCode::UNAUTHORIZED,
    })?;

    let organization_id = principal
        .organization_id()
        .map(str::to_owned)
        .unwrap_or_else(|| "0".to_string());
    let operator_id = trim(principal.user_id()).to_owned();

    Ok(sdkwork_modelkit_preferences_service::ModelkitActorContext {
        tenant_id: trim(principal.tenant_id()).to_owned(),
        organization_id: trim(&organization_id).to_owned(),
        subject_type: "user".to_string(),
        subject_id: operator_id.clone(),
        operator_id,
    })
}
