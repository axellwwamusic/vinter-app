-- Run this SQL in your Supabase project → SQL Editor

-- Table to store financial data per user per year
CREATE TABLE IF NOT EXISTS financial_data (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  year        INTEGER NOT NULL DEFAULT 2026,
  data        JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, year)
);

-- Row Level Security: each user can only see/edit their own data
ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON financial_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON financial_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON financial_data FOR UPDATE
  USING (auth.uid() = user_id);
