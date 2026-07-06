-- SDKWork modelkit consolidated initialization baseline (sqlite)

CREATE TABLE IF NOT EXISTS mk_preference_entry (
    tenant_id TEXT NOT NULL,
    organization_id TEXT NOT NULL DEFAULT '0',
    subject_type TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    namespace TEXT NOT NULL,
    payload TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, organization_id, subject_type, subject_id, namespace),
    CHECK (length(trim(namespace)) BETWEEN 1 AND 128),
    CHECK (version >= 1)
);

CREATE INDEX IF NOT EXISTS ix_mk_preference_entry_subject
    ON mk_preference_entry (tenant_id, organization_id, subject_type, subject_id);

CREATE TABLE IF NOT EXISTS mk_catalog_item (
    item_id TEXT PRIMARY KEY,
    domain TEXT NOT NULL,
    category TEXT NOT NULL,
    payload TEXT NOT NULL,
    drive_object_ref TEXT,
    tenant_id TEXT NOT NULL,
    organization_id TEXT NOT NULL DEFAULT '0',
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (length(trim(domain)) BETWEEN 1 AND 64),
    CHECK (length(trim(category)) BETWEEN 1 AND 128),
    CHECK (version >= 1)
);

CREATE INDEX IF NOT EXISTS ix_mk_catalog_item_domain_category
    ON mk_catalog_item (domain, category);
