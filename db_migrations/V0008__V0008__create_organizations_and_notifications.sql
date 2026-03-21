CREATE TABLE IF NOT EXISTS t_p32572441_gta5_activity_journa.organizations (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(64) NOT NULL,
  tag           VARCHAR(16) NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  leader_id     INTEGER DEFAULT NULL,
  leader_name   VARCHAR(64) NOT NULL DEFAULT 'none',
  member_ids    INTEGER[] NOT NULL DEFAULT '{}',
  org_ranks     JSONB NOT NULL DEFAULT '[]',
  member_ranks  JSONB NOT NULL DEFAULT '{}',
  created_at    DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS t_p32572441_gta5_activity_journa.notifications (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL,
  text        TEXT NOT NULL,
  type        VARCHAR(16) NOT NULL DEFAULT 'info',
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_uid ON t_p32572441_gta5_activity_journa.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_orgs_leader ON t_p32572441_gta5_activity_journa.organizations(leader_id);
