-- Create waitlist table
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for waitlist
CREATE POLICY "Anyone can join the waitlist"
ON public.waitlist
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Admins can view all waitlist entries"
ON public.waitlist
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update waitlist entries"
ON public.waitlist
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create index on email for faster lookups
CREATE INDEX idx_waitlist_email ON public.waitlist(email);

-- Create index on status for filtering
CREATE INDEX idx_waitlist_status ON public.waitlist(status);
