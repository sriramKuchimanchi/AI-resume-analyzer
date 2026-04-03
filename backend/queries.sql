
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


  overall_score INTEGER,
  ats_score INTEGER,
  skills_score INTEGER,
  experience_score INTEGER,
  structure_score INTEGER,
  keyword_score INTEGER,


  inferred_role TEXT,

  keywords_detected TEXT[],
  missing_keywords TEXT[],


  created_at TIMESTAMP DEFAULT NOW()
);

alyses_role 
ON analyses(inferred_role);


CREATE INDEX IF NOT EXISTS idx_analyses_created_at 
ON analyses(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analyses_overall_score 
ON analyses(overall_score);