use serde::{Deserialize, Serialize};
use sdkwork_modelkit_preferences_service::ModelkitActorContext;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CatalogItem {
    pub item_id: String,
    pub domain: String,
    pub category: String,
    pub payload: serde_json::Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub drive_object_ref: Option<String>,
    pub version: i64,
}

#[derive(Debug, Clone, Default)]
pub struct CatalogListQuery {
    pub category: Option<String>,
    pub q: Option<String>,
    pub offset: i64,
    pub limit: i64,
}

#[derive(Debug, Clone)]
pub struct CatalogListResult {
    pub items: Vec<CatalogItem>,
    pub total_items: i64,
}

pub struct CatalogDomain;

impl CatalogDomain {
    pub const SKILLHUB: &'static str = "skillhub";
    pub const PLUGINS: &'static str = "plugins";
    pub const RELAY: &'static str = "relay";
    pub const SOFTWARE: &'static str = "software";
    pub const REPOS: &'static str = "repos";
    pub const NEWS: &'static str = "news";
    pub const SHOP: &'static str = "shop";
    pub const PROMPTS: &'static str = "prompts";

    pub fn is_allowed(domain: &str) -> bool {
        matches!(
            domain,
            Self::SKILLHUB
                | Self::PLUGINS
                | Self::RELAY
                | Self::SOFTWARE
                | Self::REPOS
                | Self::NEWS
                | Self::SHOP
                | Self::PROMPTS
        )
    }

    pub fn default_categories(domain: &str) -> &'static [&'static str] {
        match domain {
            Self::SKILLHUB | Self::PLUGINS => &[
                "All",
                "Installed",
                "MCP Tools",
                "Prompts",
                "Workflows",
                "Dev Tools",
                "Data & APIs",
                "Security",
                "Automation",
                "Other",
            ],
            Self::RELAY => &["All", "Public", "Private", "Regional", "Enterprise"],
            Self::SOFTWARE => &["All", "Productivity", "Developer Tools", "Security", "AI"],
            Self::REPOS => &["All", "Featured", "Trending", "New Releases"],
            Self::NEWS => &["All", "Security", "AI", "DevOps", "Industry"],
            Self::SHOP => &["all", "api-credits", "keys", "hardware", "merchandise"],
            Self::PROMPTS => &["all", "text", "agent", "image", "video", "music", "sound"],
            _ => &["All"],
        }
    }
}

pub type CatalogActorContext = ModelkitActorContext;
