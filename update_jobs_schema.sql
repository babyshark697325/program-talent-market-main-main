-- Add user_id column to jobs table if it doesn't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'jobs' and column_name = 'user_id') then
        alter table public.jobs add column user_id uuid references auth.users(id);
    end if;
end $$;

-- Update RLS policies to check user_id for updates/deletes
drop policy if exists "Users can update their own jobs" on public.jobs;
create policy "Users can update their own jobs"
  on public.jobs
  for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own jobs" on public.jobs;
create policy "Users can delete their own jobs"
  on public.jobs
  for delete
  using (auth.uid() = user_id);
  
-- Allow authenticated users to insert their own jobs
drop policy if exists "Allow authenticated users to insert" on public.jobs;
create policy "Allow authenticated users to insert"
  on public.jobs
  for insert
  with check (auth.role() = 'authenticated' and auth.uid() = user_id);
