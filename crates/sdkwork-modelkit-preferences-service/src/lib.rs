pub mod domain;
pub mod error;
pub mod ports;
pub mod service;

pub use domain::{ModelkitActorContext, PreferenceEntry, PreferenceNamespace};
pub use error::PreferencesProductError;
pub use ports::PreferenceRepository;
pub use service::PreferencesService;
