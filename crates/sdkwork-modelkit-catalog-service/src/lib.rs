pub mod domain;
pub mod error;
pub mod ports;
pub mod service;

pub use domain::{CatalogDomain, CatalogItem, CatalogListQuery, CatalogListResult};
pub use error::CatalogProductError;
pub use ports::CatalogRepository;
pub use service::CatalogService;
