-- Create reviews table
create table if not exists public.reviews (
  id bigint primary key generated always as identity,
  reviewer_id text not null, -- Can be UUID or string for legacy/mock
  reviewer_name text not null,
  reviewer_avatar text,
  reviewer_type text check (reviewer_type in ('student', 'client')),
  target_id text not null, -- Can be UUID or string
  target_type text check (target_type in ('student', 'client', 'learning_resource')),
  rating integer check (rating >= 1 and rating <= 5),
  title text,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_title text,
  project_id text,
  helpful_count integer default 0,
  verified boolean default false,
  tags text[] default array[]::text[]
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Policies
create policy "Allow public read access"
  on public.reviews
  for select
  using (true);

create policy "Allow authenticated insert"
  on public.reviews
  for insert
  with check (auth.role() = 'authenticated');

-- Insert seed data (converted from mockReviews.ts)
INSERT INTO public.reviews (
  reviewer_id, reviewer_name, reviewer_avatar, reviewer_type,
  target_id, target_type, rating, title, comment, created_at,
  project_title, project_id, helpful_count, verified, tags
) VALUES
(
  'client_1', 'Local Boutique', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&h=200&q=80', 'client',
  '1', 'student', 5, 'Exceptional E-commerce Development', 'Alex delivered an outstanding e-commerce website that exceeded our expectations. The site is fast, user-friendly, and the payment integration works flawlessly. Alex was professional throughout the project, communicated regularly, and delivered ahead of schedule. Highly recommended!', '2024-01-28',
  'Build E-commerce Website', '1', 12, true, ARRAY['E-commerce', 'Professional', 'On-time', 'Excellent Communication']
),
(
  'client_2', 'Fitness Studio', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=200&h=200&q=80', 'client',
  '2', 'student', 5, 'Creative and Professional Design Work', 'Jamie created amazing social media graphics that perfectly captured our brand aesthetic. The designs are vibrant, engaging, and have significantly increased our social media engagement. Great attention to detail and very responsive to feedback.', '2024-01-25',
  'Social Media Graphics Package', '2', 8, true, ARRAY['Creative', 'Brand-focused', 'High Quality', 'Responsive']
),
(
  'client_5', 'HealthTech Inc', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=200&h=200&q=80', 'client',
  '3', 'student', 4, 'Solid 3D Visualization Work', 'Morgan delivered quality 3D product visualizations that look professional and detailed. The models were accurate and the lighting/texturing was well done. Could have been a bit faster with revisions, but overall satisfied with the final result.', '2024-02-05',
  '3D Product Visualization', '3', 5, true, ARRAY['3D Modeling', 'Professional Quality', 'Detailed Work']
),
(
  'client_7', 'Marketing Agency Pro', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=200&h=200&q=80', 'client',
  '4', 'student', 5, 'Outstanding Game Development Skills', 'Samira built an incredible 2D platformer prototype that impressed our entire team. The gameplay mechanics are smooth, the level design is creative, and the code is clean and well-documented. Excellent communication and project management skills.', '2024-02-08',
  'Indie Game Development', '4', 15, true, ARRAY['Game Development', 'Creative', 'Technical Excellence', 'Team Player']
),
(
  'client_8', 'Design Co', 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?auto=format&fit=crop&w=200&h=200&q=80', 'client',
  '5', 'student', 4, 'Quality Graphic Design Services', 'Ethan provided solid graphic design work for our marketing materials. The designs were professional and aligned with our brand guidelines. Good communication throughout the project. Would work with again.', '2024-01-30',
  'Marketing Materials Design', 'custom_1', 6, true, ARRAY['Graphic Design', 'Professional', 'Brand-aligned']
);
