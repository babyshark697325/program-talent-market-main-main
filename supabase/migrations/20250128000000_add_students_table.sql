-- Create students table for student profiles and services
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
  affiliation TEXT CHECK (affiliation IN ('student', 'alumni')) DEFAULT 'student',
  about_me TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  upwork_url TEXT,
  fiverr_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create student portfolio table
CREATE TABLE IF NOT EXISTS student_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_is_active ON students(is_active);
CREATE INDEX IF NOT EXISTS idx_students_affiliation ON students(affiliation);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at);
CREATE INDEX IF NOT EXISTS idx_student_portfolio_student_id ON student_portfolio(student_id);

-- Enable RLS (Row Level Security)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_portfolio ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students table
CREATE POLICY "Students are viewable by everyone" ON students
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can insert their own student profile" ON students
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own student profile" ON students
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own student profile" ON students
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for student_portfolio table
CREATE POLICY "Portfolio items are viewable by everyone" ON student_portfolio
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = student_portfolio.student_id 
      AND students.is_active = true
    )
  );

CREATE POLICY "Users can manage their own portfolio" ON student_portfolio
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = student_portfolio.student_id 
      AND students.user_id = auth.uid()
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_portfolio_updated_at BEFORE UPDATE ON student_portfolio
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();