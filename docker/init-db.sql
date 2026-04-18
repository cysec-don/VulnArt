-- ==============================
-- Vuln Art Shop - Database Initialization
-- This runs on first PostgreSQL container start
-- ==============================

-- Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The schema will be managed by Prisma migrations
-- This init script adds additional seed data for the CTF environment

-- Insert hidden log entries (clues for CTF participants)
INSERT INTO "HiddenLog" ("id", "eventType", "message", "metadata", "createdAt") VALUES
(DEFAULT, 'system_init', 'Database initialized successfully', '{"version": "1.0.0", "environment": "production"}', NOW()),
(DEFAULT, 'admin_access', 'Admin panel accessed from internal network', '{"ip": "172.28.0.1", "path": "/admin-panel-x7k9"}', NOW()),
(DEFAULT, 'credential_reset', 'Backup admin account password reset', '{"username": "backup_admin", "newPassword": "bkp@dm1n!"}', NOW()),
(DEFAULT, 'debug_enabled', 'Debug mode was enabled for testing', '{"endpoint": "/api/debug/env", "flag": "FLAG{d3bug_m0d3_l34k}"}', NOW()),
(DEFAULT, 'vhost_discovery', 'Virtual host admin.vulnart.local configured', '{"flag": "FLAG{vh0st_3num3r4t10n_w1n}", "port": 3001}', NOW()),
(DEFAULT, 'dev_server', 'Development server running on port 3002', '{"flag": "FLAG{d3v_vh0st_3xp0s3d}", "environment": "development"}', NOW()),
(DEFAULT, 'staging_deploy', 'Staging environment deployed', '{"flag": "FLAG{st4g1ng_3nv_fl4g}", "url": "staging.vulnart.local"}', NOW()),
(DEFAULT, 'backup_cron', 'Automated backup job configured', '{"schedule": "0 2 * * *", "path": "/backup/db-backup.sql"}', NOW()),
(DEFAULT, 'secret_rotation', 'API secret key rotation scheduled', '{"oldKey": "vuln_art_secret_2024", "newKey": "vuln_art_secret_2025"}', NOW()),
(DEFAULT, 'master_flag', 'Master flag generated for CTF completion', '{"flag": "FLAG{m4st3r_0f_vuln}", "tier": "expert", "points": 1000}', NOW());
