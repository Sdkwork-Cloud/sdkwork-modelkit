use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelkitActorContext {
    pub tenant_id: String,
    pub organization_id: String,
    pub subject_type: String,
    pub subject_id: String,
    pub operator_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PreferenceEntry {
    pub namespace: String,
    pub payload: serde_json::Value,
    pub version: i64,
}

pub struct PreferenceNamespace;

impl PreferenceNamespace {
    pub const WORKSPACE_API_KEYS: &'static str = "workspace.api_keys";
    pub const WORKSPACE_RELAYS: &'static str = "workspace.relays";
    pub const WORKSPACE_PROVIDERS: &'static str = "workspace.providers";
    pub const WORKSPACE_REQUEST_LOGS: &'static str = "workspace.request_logs";
    pub const WORKSPACE_VIP: &'static str = "workspace.vip";
    pub const WORKSPACE_AGENTS: &'static str = "workspace.agents";
    pub const WORKSPACE_RESOURCES: &'static str = "workspace.resources";
    pub const WORKSPACE_AGENT_TOOLS: &'static str = "workspace.agent_tools";
    pub const ACCOUNT_BILLING: &'static str = "account.billing";
    pub const ACCOUNT_API_KEYS: &'static str = "account.api_keys";
    pub const USER_PROFILE: &'static str = "user.profile";
    pub const SYSTEM_SETTINGS: &'static str = "system.settings";
    pub const SHOP_CART: &'static str = "shop.cart";
    pub const SHOP_ORDERS: &'static str = "shop.orders";
    pub const UI_SETTINGS: &'static str = "ui.settings";

    pub fn is_allowed(namespace: &str) -> bool {
        matches!(
            namespace,
            Self::WORKSPACE_API_KEYS
                | Self::WORKSPACE_RELAYS
                | Self::WORKSPACE_PROVIDERS
                | Self::WORKSPACE_REQUEST_LOGS
                | Self::WORKSPACE_VIP
                | Self::WORKSPACE_AGENTS
                | Self::WORKSPACE_RESOURCES
                | Self::WORKSPACE_AGENT_TOOLS
                | Self::ACCOUNT_BILLING
                | Self::ACCOUNT_API_KEYS
                | Self::USER_PROFILE
                | Self::SYSTEM_SETTINGS
                | Self::SHOP_CART
                | Self::SHOP_ORDERS
                | Self::UI_SETTINGS
        )
    }
}
