use sdkwork_web_core::WebRequestContext;

use crate::actor_context::AuthProblem;

pub fn require_permission(
    _app_ctx: &WebRequestContext,
    _permission: &str,
) -> Result<(), AuthProblem> {
    Ok(())
}
