export const SYNC_QUEUE_TABLE = `
  CREATE TABLE IF NOT EXISTS sync_queue (
    id TEXT PRIMARY KEY NOT NULL,
    type TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    retry_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending'
  );
`;

export const AUTH_SESSION_TABLE = `
  CREATE TABLE IF NOT EXISTS auth_session (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    avatar TEXT
  );
`;

export const VACATION_REQUESTS_TABLE = `
  CREATE TABLE IF NOT EXISTS vacation_requests (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    status TEXT NOT NULL,
    collaborator_notes TEXT,
    manager_notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    requester_name TEXT,
    requester_avatar TEXT
  );
`;

export const ADMIN_REPORTS_TABLE = `
  CREATE TABLE IF NOT EXISTS admin_reports (
    total_requests INTEGER DEFAULT 0,
    approved_requests INTEGER DEFAULT 0,
    pending_requests INTEGER DEFAULT 0,
    rejected_requests INTEGER DEFAULT 0,
    total_collaborators INTEGER DEFAULT 0,
    total_managers INTEGER DEFAULT 0,
    active_collaborators INTEGER DEFAULT 0,
    pending_registrations INTEGER DEFAULT 0,
    new_requests_this_month INTEGER DEFAULT 0,
    approved_requests_this_month INTEGER DEFAULT 0,
    new_registrations_this_month INTEGER DEFAULT 0
  );
`;

export const ADMIN_PENDING_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS admin_pending_users (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`;

export const ADMIN_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    avatar_url TEXT
  );
`;

export const SCHEMA_VERSION = 1;
