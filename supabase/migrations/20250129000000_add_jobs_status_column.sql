-- Add status column to jobs table if it doesn't exist
DO $$ 
BEGIN
    -- Create job_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status') THEN
        CREATE TYPE public.job_status AS ENUM ('active', 'flagged', 'removed', 'completed');
    END IF;
    
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'jobs' 
                   AND column_name = 'status') THEN
        ALTER TABLE public.jobs 
        ADD COLUMN status public.job_status NOT NULL DEFAULT 'active';
        
        -- Create index for the new status column
        CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
    END IF;
END $$;