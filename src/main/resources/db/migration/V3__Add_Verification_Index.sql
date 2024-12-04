CREATE INDEX idx_users_email_verified ON users(email, verified);

UPDATE users SET verified = false WHERE verified IS NULL;
