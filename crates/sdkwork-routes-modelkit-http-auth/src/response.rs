use axum::http::{HeaderName, HeaderValue, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::Json;
use sdkwork_modelkit_catalog_service::error::CatalogProductError;
use sdkwork_modelkit_preferences_service::error::PreferencesProductError;
use sdkwork_utils_rust::{legacy_wire_result_code, SdkWorkApiResponse, SdkWorkResultCode};
use sdkwork_web_core::{
    problem_response, WebFrameworkError, WebFrameworkErrorKind, WebRequestContext,
};
use serde::Serialize;

pub type ApiResult<T> = Result<T, ApiProblem>;

#[derive(Debug, Clone)]
pub struct ApiProblem {
    pub message: String,
    status: StatusCode,
    code: SdkWorkResultCode,
}

impl ApiProblem {
    pub fn bad_request(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            status: StatusCode::BAD_REQUEST,
            code: SdkWorkResultCode::ValidationError,
        }
    }

    pub fn forbidden(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            status: StatusCode::FORBIDDEN,
            code: SdkWorkResultCode::PermissionRequired,
        }
    }

    pub fn not_found(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            status: StatusCode::NOT_FOUND,
            code: SdkWorkResultCode::NotFound,
        }
    }

    pub fn internal(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            status: StatusCode::INTERNAL_SERVER_ERROR,
            code: SdkWorkResultCode::InternalError,
        }
    }

    pub fn from_auth(problem: crate::actor_context::AuthProblem) -> Self {
        let code = match problem.code.as_str() {
            "modelkit.auth.missing_principal" | "modelkit.auth.missing_tenant" => {
                SdkWorkResultCode::AuthenticationRequired
            }
            "modelkit.permission_denied" => SdkWorkResultCode::PermissionRequired,
            _ => legacy_wire_result_code(&problem.code),
        };
        Self {
            message: problem.detail,
            status: problem.status,
            code,
        }
    }

    fn framework_error(&self) -> WebFrameworkError {
        let kind = match self.status {
            StatusCode::BAD_REQUEST => WebFrameworkErrorKind::BadRequest,
            StatusCode::UNAUTHORIZED => WebFrameworkErrorKind::MissingCredentials,
            StatusCode::FORBIDDEN => WebFrameworkErrorKind::Forbidden,
            StatusCode::NOT_FOUND => WebFrameworkErrorKind::NotFound,
            _ => match self.code {
                SdkWorkResultCode::ValidationError => WebFrameworkErrorKind::BadRequest,
                SdkWorkResultCode::AuthenticationRequired => {
                    WebFrameworkErrorKind::MissingCredentials
                }
                SdkWorkResultCode::PermissionRequired => WebFrameworkErrorKind::Forbidden,
                SdkWorkResultCode::NotFound => WebFrameworkErrorKind::NotFound,
                _ => WebFrameworkErrorKind::InternalServerError,
            },
        };
        WebFrameworkError {
            kind,
            message: self.message.clone(),
            retry_after_seconds: None,
        }
    }

    pub fn into_response_for(&self, ctx: &WebRequestContext) -> Response {
        problem_response(&self.framework_error(), ctx.problem_correlation())
    }
}

pub fn map_product_error(error: PreferencesProductError) -> ApiProblem {
    match error {
        PreferencesProductError::Validation(detail) => ApiProblem::bad_request(detail),
        PreferencesProductError::NotFound(detail) => ApiProblem::not_found(detail),
        PreferencesProductError::PermissionDenied(detail) => ApiProblem::forbidden(detail),
        PreferencesProductError::Internal(_) => {
            ApiProblem::internal("An unexpected error occurred".to_string())
        }
    }
}

pub fn map_catalog_error(error: CatalogProductError) -> ApiProblem {
    match error {
        CatalogProductError::Validation(detail) => ApiProblem::bad_request(detail),
        CatalogProductError::NotFound(detail) => ApiProblem::not_found(detail),
        CatalogProductError::Internal(_) => {
            ApiProblem::internal("An unexpected error occurred".to_string())
        }
    }
}

fn success_response<T: Serialize>(
    ctx: &WebRequestContext,
    status: StatusCode,
    data: T,
) -> Result<Response, ApiProblem> {
    let trace_id = ctx.resolved_trace_id();
    let envelope = SdkWorkApiResponse::success(data, trace_id.clone());
    let mut response = (status, Json(envelope)).into_response();
    if let Ok(value) = HeaderValue::from_str(&trace_id) {
        response
            .headers_mut()
            .insert(HeaderName::from_static("x-sdkwork-trace-id"), value);
    }
    Ok(response)
}

pub fn finish_api_json<T: Serialize>(ctx: &WebRequestContext, result: ApiResult<T>) -> Response {
    match result {
        Ok(data) => success_response(ctx, StatusCode::OK, data)
            .unwrap_or_else(|problem| problem.into_response_for(ctx)),
        Err(problem) => problem.into_response_for(ctx),
    }
}

pub fn finish_created_json<T: Serialize>(
    ctx: &WebRequestContext,
    result: ApiResult<T>,
) -> Response {
    match result {
        Ok(data) => success_response(ctx, StatusCode::CREATED, data)
            .unwrap_or_else(|problem| problem.into_response_for(ctx)),
        Err(problem) => problem.into_response_for(ctx),
    }
}
