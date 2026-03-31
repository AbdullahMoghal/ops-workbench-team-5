-- =============================================================================
-- Warehouse Ops: Exception & Resolution Workbench
-- Migration 002: Seed / Demo Data
-- =============================================================================

-- =============================================================================
-- ROLES
-- =============================================================================
INSERT INTO roles (id, name, description) VALUES
    ('11111111-0000-0000-0000-000000000001', 'Admin',              'Full system access including user and configuration management'),
    ('11111111-0000-0000-0000-000000000002', 'OpsManager',         'Operations manager with dashboard, reports, and escalation approval'),
    ('11111111-0000-0000-0000-000000000003', 'Supervisor',         'Floor supervisor with review queue access and adjustment approval'),
    ('11111111-0000-0000-0000-000000000004', 'WarehouseAssociate', 'Warehouse associate who reports issues and views own tickets');

-- =============================================================================
-- USERS
-- =============================================================================
INSERT INTO users (id, full_name, email, role_id, status) VALUES
    ('22222222-0000-0000-0000-000000000001', 'Alex Turner',    'admin@warehouse.demo',      '11111111-0000-0000-0000-000000000001', 'active'),
    ('22222222-0000-0000-0000-000000000002', 'Sarah Johnson',  'ops@warehouse.demo',        '11111111-0000-0000-0000-000000000002', 'active'),
    ('22222222-0000-0000-0000-000000000003', 'Mike Rivera',    'supervisor@warehouse.demo', '11111111-0000-0000-0000-000000000003', 'active'),
    ('22222222-0000-0000-0000-000000000004', 'Jordan Lee',     'supervisor2@warehouse.demo','11111111-0000-0000-0000-000000000003', 'active'),
    ('22222222-0000-0000-0000-000000000005', 'Casey Williams', 'associate@warehouse.demo',  '11111111-0000-0000-0000-000000000004', 'active'),
    ('22222222-0000-0000-0000-000000000006', 'Dana Kim',       'associate2@warehouse.demo', '11111111-0000-0000-0000-000000000004', 'active'),
    ('22222222-0000-0000-0000-000000000007', 'Riley Morgan',   'associate3@warehouse.demo', '11111111-0000-0000-0000-000000000004', 'active');

-- =============================================================================
-- LOCATIONS
-- =============================================================================
INSERT INTO locations (id, warehouse, zone, bin) VALUES
    ('33333333-0000-0000-0000-000000000001', 'WH-MAIN', 'A', 'A-12-04'),
    ('33333333-0000-0000-0000-000000000002', 'WH-MAIN', 'A', 'A-15-02'),
    ('33333333-0000-0000-0000-000000000003', 'WH-MAIN', 'B', 'B-04-07'),
    ('33333333-0000-0000-0000-000000000004', 'WH-MAIN', 'B', 'B-09-01'),
    ('33333333-0000-0000-0000-000000000005', 'WH-MAIN', 'C', 'C-01-03'),
    ('33333333-0000-0000-0000-000000000006', 'WH-MAIN', 'C', 'C-08-11'),
    ('33333333-0000-0000-0000-000000000007', 'WH-MAIN', 'D', 'D-09-05'),
    ('33333333-0000-0000-0000-000000000008', 'WH-MAIN', 'D', 'D-03-08'),
    ('33333333-0000-0000-0000-000000000009', 'WH-EAST', 'E', 'E-01-01'),
    ('33333333-0000-0000-0000-000000000010', 'WH-EAST', 'F', 'F-05-03');

-- =============================================================================
-- CATEGORIES
-- =============================================================================
INSERT INTO categories (id, category_name, description) VALUES
    ('44444444-0000-0000-0000-000000000001', 'Footwear',     'Shoes, boots, and athletic footwear'),
    ('44444444-0000-0000-0000-000000000002', 'Apparel',      'Clothing and wearable goods'),
    ('44444444-0000-0000-0000-000000000003', 'Electronics',  'Electronic devices and accessories'),
    ('44444444-0000-0000-0000-000000000004', 'Sports',       'Sports equipment and accessories'),
    ('44444444-0000-0000-0000-000000000005', 'Home Goods',   'Household items and appliances'),
    ('44444444-0000-0000-0000-000000000006', 'Perishables',  'Food and perishable goods');

-- =============================================================================
-- INVENTORY ITEMS
-- =============================================================================
INSERT INTO inventory_items (id, sku, item_name, category_id) VALUES
    ('55555555-0000-0000-0000-000000000001', '882910-BLK', 'Nike Air Zoom Pegasus',     '44444444-0000-0000-0000-000000000001'),
    ('55555555-0000-0000-0000-000000000002', '773421-WHT', 'Adidas Ultraboost 22',      '44444444-0000-0000-0000-000000000001'),
    ('55555555-0000-0000-0000-000000000003', '661033-NVY', 'Under Armour Hoodie XL',    '44444444-0000-0000-0000-000000000002'),
    ('55555555-0000-0000-0000-000000000004', '994712-RED', 'Sony WH-1000XM5 Headphones','44444444-0000-0000-0000-000000000003'),
    ('55555555-0000-0000-0000-000000000005', '112834-GRN', 'Wilson Tennis Racket Pro',  '44444444-0000-0000-0000-000000000004'),
    ('55555555-0000-0000-0000-000000000006', '338829-BLU', 'Instant Pot 6QT Duo',       '44444444-0000-0000-0000-000000000005'),
    ('55555555-0000-0000-0000-000000000007', '445501-ORG', 'Organic Granola Bars x24',  '44444444-0000-0000-0000-000000000006'),
    ('55555555-0000-0000-0000-000000000008', '667743-SLV', 'Apple AirPods Pro 2nd Gen', '44444444-0000-0000-0000-000000000003'),
    ('55555555-0000-0000-0000-000000000009', '223398-BLK', 'North Face Jacket L',       '44444444-0000-0000-0000-000000000002'),
    ('55555555-0000-0000-0000-000000000010', '889201-YLW', 'Yeti Rambler 30oz Tumbler', '44444444-0000-0000-0000-000000000005');

-- =============================================================================
-- TICKETS
-- =============================================================================
INSERT INTO tickets (id, ticket_number, created_by_user_id, assigned_to_user_id, location_id, category_id, inventory_item_id, ticket_type, status, priority, quantity, title, description, estimated_value_impact, created_at, updated_at) VALUES

-- Resolved tickets (historical)
('66666666-0000-0000-0000-000000000001', 'EX-1001',
 '22222222-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000003',
 '33333333-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001',
 '55555555-0000-0000-0000-000000000001',
 'Count Mismatch', 'resolved', 'high', 8,
 'Stock Mismatch – Nike Air Zoom Pegasus',
 'System count shows 150 units; physical count shows 142. Scanner #42 confirmed.',
 840.00,
 NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days'),

('66666666-0000-0000-0000-000000000002', 'EX-1002',
 '22222222-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000003',
 '33333333-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000002',
 '55555555-0000-0000-0000-000000000003',
 'Damaged Goods', 'resolved', 'medium', 5,
 'Damaged Hoodies – Water Damage on Box',
 'Found 5 units with water damage in zone B. Packaging compromised.',
 299.95,
 NOW() - INTERVAL '9 days', NOW() - INTERVAL '7 days'),

('66666666-0000-0000-0000-000000000003', 'EX-1003',
 '22222222-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000004',
 '33333333-0000-0000-0000-000000000005', '44444444-0000-0000-0000-000000000003',
 '55555555-0000-0000-0000-000000000004',
 'Missing Item', 'resolved', 'critical', 3,
 'Missing Sony Headphones – High Value',
 'Three units not found during cycle count. High value item requiring immediate escalation.',
 1049.97,
 NOW() - INTERVAL '8 days', NOW() - INTERVAL '6 days'),

-- In-progress / pending tickets
('66666666-0000-0000-0000-000000000004', 'EX-1004',
 '22222222-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000003',
 '33333333-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000001',
 '55555555-0000-0000-0000-000000000002',
 'Missing Item', 'in_progress', 'high', 4,
 'Missing Adidas Ultraboost Units in Zone A-15',
 'Received shipment of 50 units; only 46 found on shelf. Investigating.',
 479.96,
 NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),

('66666666-0000-0000-0000-000000000005', 'EX-1005',
 '22222222-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000004',
 '33333333-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000002',
 '55555555-0000-0000-0000-000000000009',
 'Damaged Goods', 'pending_review', 'medium', 2,
 'North Face Jacket – Torn Zipper Damage',
 'Two jackets found with damaged zippers. Reported by associate during unloading.',
 259.90,
 NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),

('66666666-0000-0000-0000-000000000006', 'EX-1006',
 '22222222-0000-0000-0000-000000000007', NULL,
 '33333333-0000-0000-0000-000000000005', '44444444-0000-0000-0000-000000000003',
 '55555555-0000-0000-0000-000000000008',
 'Count Mismatch', 'new', 'high', 12,
 'AirPods Pro Count Mismatch – Zone C',
 'Physical count 38 vs system count 50. Significant discrepancy needs urgent review.',
 3599.88,
 NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

('66666666-0000-0000-0000-000000000007', 'EX-1007',
 '22222222-0000-0000-0000-000000000005', NULL,
 '33333333-0000-0000-0000-000000000007', '44444444-0000-0000-0000-000000000003',
 '55555555-0000-0000-0000-000000000004',
 'System Error', 'new', 'critical', 0,
 'System Error – Scanner Offline Zone D-09',
 'Scanner in zone D-09 went offline during cycle count. Data incomplete.',
 0.00,
 NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),

('66666666-0000-0000-0000-000000000008', 'EX-1008',
 '22222222-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000003',
 '33333333-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000005',
 '55555555-0000-0000-0000-000000000006',
 'Wrong Location', 'in_progress', 'low', 10,
 'Instant Pot Units in Wrong Zone',
 '10 units found in zone B-09 but should be in D zone. Relocation in progress.',
 899.90,
 NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days'),

('66666666-0000-0000-0000-000000000009', 'EX-1009',
 '22222222-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000002',
 '33333333-0000-0000-0000-000000000009', '44444444-0000-0000-0000-000000000006',
 '55555555-0000-0000-0000-000000000007',
 'Expiry Issue', 'escalated', 'critical', 48,
 'Granola Bars Approaching Expiry – WH-EAST',
 '48 boxes of granola bars expire within 5 days. Escalated for immediate action.',
 288.00,
 NOW() - INTERVAL '1 day', NOW() - INTERVAL '5 hours'),

('66666666-0000-0000-0000-000000000010', 'EX-1010',
 '22222222-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000004',
 '33333333-0000-0000-0000-000000000006', '44444444-0000-0000-0000-000000000004',
 '55555555-0000-0000-0000-000000000005',
 'Missing Label', 'pending_review', 'low', 15,
 'Tennis Rackets Missing SKU Labels',
 '15 Wilson Tennis Rackets arrived without SKU labels. Cannot shelve until labeled.',
 1124.85,
 NOW() - INTERVAL '5 hours', NOW() - INTERVAL '4 hours'),

('66666666-0000-0000-0000-000000000011', 'EX-1011',
 '22222222-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000003',
 '33333333-0000-0000-0000-000000000008', '44444444-0000-0000-0000-000000000005',
 '55555555-0000-0000-0000-000000000010',
 'Count Mismatch', 'pending_review', 'medium', 7,
 'Yeti Tumbler Count Discrepancy Zone D-03',
 'System shows 30 units, physical count is 23. Possible misplacement.',
 277.93,
 NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours'),

('66666666-0000-0000-0000-000000000012', 'EX-1012',
 '22222222-0000-0000-0000-000000000007', NULL,
 '33333333-0000-0000-0000-000000000010', '44444444-0000-0000-0000-000000000002',
 '55555555-0000-0000-0000-000000000003',
 'Wrong SKU', 'new', 'medium', 20,
 'Wrong SKU Labels on Hoodie Shipment',
 'Incoming shipment of 20 hoodies labeled with wrong SKU. Cannot process.',
 599.80,
 NOW() - INTERVAL '1 hour', NOW());

-- =============================================================================
-- DISCREPANCY DETAILS
-- =============================================================================
INSERT INTO discrepancy_details (id, ticket_id, item_id, expected_qty, actual_qty, variance_value) VALUES
    ('77777777-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000001',
     '55555555-0000-0000-0000-000000000001', 150, 142, -840.00),

    ('77777777-0000-0000-0000-000000000002', '66666666-0000-0000-0000-000000000003',
     '55555555-0000-0000-0000-000000000004', 6, 3, -1049.97),

    ('77777777-0000-0000-0000-000000000003', '66666666-0000-0000-0000-000000000004',
     '55555555-0000-0000-0000-000000000002', 50, 46, -479.96),

    ('77777777-0000-0000-0000-000000000004', '66666666-0000-0000-0000-000000000006',
     '55555555-0000-0000-0000-000000000008', 50, 38, -3599.88),

    ('77777777-0000-0000-0000-000000000005', '66666666-0000-0000-0000-000000000011',
     '55555555-0000-0000-0000-000000000010', 30, 23, -277.93);

-- =============================================================================
-- INVENTORY ADJUSTMENTS
-- =============================================================================
INSERT INTO inventory_adjustments (id, discrepancy_id, approved_by_user_id, decision, justification, adjustment_code, financial_impact, approved_at) VALUES
    ('88888888-0000-0000-0000-000000000001',
     '77777777-0000-0000-0000-000000000001',
     '22222222-0000-0000-0000-000000000003',
     'approved',
     'Physical recount confirmed. Units marked as inventory loss. Shrinkage code applied.',
     'ADJ-SHRINK-001',
     -840.00,
     NOW() - INTERVAL '7 days'),

    ('88888888-0000-0000-0000-000000000002',
     '77777777-0000-0000-0000-000000000002',
     '22222222-0000-0000-0000-000000000002',
     'approved',
     'Items confirmed missing after security review. Probable theft. Financial write-off approved.',
     'ADJ-LOSS-002',
     -1049.97,
     NOW() - INTERVAL '5 days');

-- =============================================================================
-- NOTES
-- =============================================================================
INSERT INTO notes (ticket_id, user_id, note_text, created_at) VALUES
    ('66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000005',
     'Recounted twice. Box damaged and empty. Marked as loss.', NOW() - INTERVAL '9 days 14 hours'),

    ('66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003',
     'Scanner #42 verified the count. Proceeding with adjustment.', NOW() - INTERVAL '9 days 2 hours'),

    ('66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002',
     'Escalated for final financial approval. Value exceeds $500 threshold.', NOW() - INTERVAL '8 days 10 hours'),

    ('66666666-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000005',
     'Checked receiving manifest — only 46 units signed off by carrier.', NOW() - INTERVAL '2 days 20 hours'),

    ('66666666-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000003',
     'Filed claim with carrier. Awaiting response within 48 hours.', NOW() - INTERVAL '2 days 8 hours'),

    ('66666666-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000007',
     'Checked all adjacent bins. Could not locate missing units.', NOW() - INTERVAL '20 hours'),

    ('66666666-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000007',
     'Flagged for immediate disposal coordination with warehouse manager.', NOW() - INTERVAL '4 hours'),

    ('66666666-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000002',
     'Contacted store receiving team. Arranging emergency transfer.', NOW() - INTERVAL '2 hours');

-- =============================================================================
-- AUDIT LOGS
-- =============================================================================
INSERT INTO audit_logs (ticket_id, user_id, action, details, timestamp) VALUES
    -- EX-1001
    ('66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000005',
     'TICKET_CREATED', 'Ticket EX-1001 created with status new', NOW() - INTERVAL '10 days'),
    ('66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003',
     'TICKET_ASSIGNED', 'Assigned to Mike Rivera', NOW() - INTERVAL '9 days 23 hours'),
    ('66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003',
     'STATUS_CHANGED', 'Status changed from new to pending_review', NOW() - INTERVAL '9 days 20 hours'),
    ('66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003',
     'STATUS_CHANGED', 'Status changed from pending_review to in_progress', NOW() - INTERVAL '9 days 10 hours'),
    ('66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002',
     'TICKET_ESCALATED', 'Escalated to OpsManager for financial approval', NOW() - INTERVAL '8 days 10 hours'),
    ('66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002',
     'ADJUSTMENT_APPROVED', 'Inventory adjustment ADJ-SHRINK-001 approved. Financial impact: -$840.00', NOW() - INTERVAL '7 days'),
    ('66666666-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003',
     'TICKET_RESOLVED', 'Ticket resolved. Inventory adjusted.', NOW() - INTERVAL '8 days'),

    -- EX-1004
    ('66666666-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000005',
     'TICKET_CREATED', 'Ticket EX-1004 created with status new', NOW() - INTERVAL '3 days'),
    ('66666666-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000003',
     'TICKET_ASSIGNED', 'Assigned to Mike Rivera', NOW() - INTERVAL '2 days 22 hours'),
    ('66666666-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000003',
     'STATUS_CHANGED', 'Status changed from new to in_progress', NOW() - INTERVAL '2 days 20 hours'),

    -- EX-1006
    ('66666666-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000007',
     'TICKET_CREATED', 'Ticket EX-1006 created with status new', NOW() - INTERVAL '1 day'),

    -- EX-1007
    ('66666666-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000005',
     'TICKET_CREATED', 'Ticket EX-1007 created with status new. CRITICAL priority auto-assigned.', NOW() - INTERVAL '6 hours'),

    -- EX-1009
    ('66666666-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000007',
     'TICKET_CREATED', 'Ticket EX-1009 created with status new', NOW() - INTERVAL '1 day'),
    ('66666666-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000002',
     'TICKET_ASSIGNED', 'Assigned to Sarah Johnson (OpsManager)', NOW() - INTERVAL '22 hours'),
    ('66666666-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000002',
     'TICKET_ESCALATED', 'Escalated — perishables require immediate ops manager action', NOW() - INTERVAL '5 hours'),

    -- EX-1012
    ('66666666-0000-0000-0000-000000000012', '22222222-0000-0000-0000-000000000007',
     'TICKET_CREATED', 'Ticket EX-1012 created with status new', NOW() - INTERVAL '1 hour');
