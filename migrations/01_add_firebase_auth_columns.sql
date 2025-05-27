-- Add Firebase authentication columns to usuarios table
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128) UNIQUE,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'email',
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_usuarios_firebase_uid ON usuarios(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_usuarios_email_verified ON usuarios(email_verified);

-- Update existing rows (if any) with default values
UPDATE usuarios SET email_verified = FALSE WHERE email_verified IS NULL;
UPDATE usuarios SET provider = 'email' WHERE provider IS NULL;
