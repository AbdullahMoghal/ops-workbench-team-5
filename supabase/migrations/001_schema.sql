-- =============================================================================
-- Warehouse Ops: Exception & Resolution Workbench
-- Migration 001: Full Schema
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ROLES
-- =============================================================================
CREATE TABLE roles (
    id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- =============================================================================
-- USERS  (mirrors Supabase Auth users via trigger or manual insert)
-- =============================================================================
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name   TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    role_id     UUID NOT NULL REFERENCES roles(id),
    status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- LOCATIONS
-- =============================================================================
CREATE TABLE locations (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse   TEXT NOT NULL,
    zone        TEXT NOT NULL,
    bin         TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (warehouse, zone, bin)
);

-- =============================================================================
-- CATEGORIES
-- =============================================================================
CREATE TABLE categories (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name TEXT NOT NULL UNIQUE,
    description   TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INVENTORY ITEMS
-- =============================================================================
CREATE TABLE inventory_items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku         TEXT NOT NULL UNIQUE,
    item_name   TEXT NOT NULL,
    category_id UUID REFERENCES categories(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TICKETS
-- =============================================================================
CREATE TABLE tickets (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number         TEXT NOT NULL UNIQUE,   -- e.g. EX-1024
    created_by_user_id    UUID NOT NULL REFERENCES users(id),
    assigned_to_user_id   UUID REFERENCES users(id),
    location_id           UUID NOT NULL REFERENCES locations(id),
    category_id           UUID REFERENCES categories(id),
    inventory_item_id     UUID NOT NULL REFERENCES inventory_items(id),
    ticket_type           TEXT NOT NULL CHECK (ticket_type IN (
                              'Missing Item','Damaged Goods','Count Mismatch',
                              'Wrong Location','Wrong SKU','System Error',
                              'Expiry Issue','Missing Label'
                          )),
    status                TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
                              'new','pending_review','in_progress',
                              'escalated','resolved','rejected','closed'
                          )),
    priority              TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN (
                              'low','medium','high','critical'
                          )),
    quantity              INTEGER NOT NULL DEFAULT 0,
    title                 TEXT NOT NULL,
    description           TEXT,
    estimated_value_impact NUMERIC(12,2) DEFAULT 0,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at             TIMESTAMPTZ
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- DISCREPANCY DETAILS
-- =============================================================================
CREATE TABLE discrepancy_details (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id       UUID NOT NULL UNIQUE REFERENCES tickets(id) ON DELETE CASCADE,
    item_id         UUID NOT NULL REFERENCES inventory_items(id),
    expected_qty    INTEGER NOT NULL,
    actual_qty      INTEGER NOT NULL,
    variance        INTEGER NOT NULL DEFAULT 0,
    variance_value  NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INVENTORY ADJUSTMENTS
-- =============================================================================
CREATE TABLE inventory_adjustments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discrepancy_id      UUID NOT NULL UNIQUE REFERENCES discrepancy_details(id) ON DELETE CASCADE,
    approved_by_user_id UUID REFERENCES users(id),
    decision            TEXT CHECK (decision IN ('approved','rejected')),
    justification       TEXT,
    adjustment_code     TEXT,
    financial_impact    NUMERIC(12,2) DEFAULT 0,
    approved_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- NOTES
-- =============================================================================
CREATE TABLE notes (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id  UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users(id),
    note_text  TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- AUDIT LOGS
-- =============================================================================
CREATE TABLE audit_logs (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id  UUID REFERENCES tickets(id) ON DELETE SET NULL,
    user_id    UUID REFERENCES users(id),
    action     TEXT NOT NULL,
    details    TEXT,
    timestamp  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES for common query patterns
-- =============================================================================
CREATE INDEX idx_tickets_status            ON tickets(status);
CREATE INDEX idx_tickets_priority          ON tickets(priority);
CREATE INDEX idx_tickets_created_by        ON tickets(created_by_user_id);
CREATE INDEX idx_tickets_assigned_to       ON tickets(assigned_to_user_id);
CREATE INDEX idx_tickets_created_at        ON tickets(created_at DESC);
CREATE INDEX idx_notes_ticket_id           ON notes(ticket_id);
CREATE INDEX idx_audit_logs_ticket_id      ON audit_logs(ticket_id);
CREATE INDEX idx_audit_logs_timestamp      ON audit_logs(timestamp DESC);
CREATE INDEX idx_discrepancy_ticket        ON discrepancy_details(ticket_id);
CREATE INDEX idx_inventory_items_sku       ON inventory_items(sku);
