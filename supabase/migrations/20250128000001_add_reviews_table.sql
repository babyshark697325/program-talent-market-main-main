-- Create reviews table for storing client reviews on student profiles
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_company TEXT,
  review_text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_featured BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_student_id ON public.reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON public.reviews(is_featured) WHERE is_featured = true;

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for reviews
-- Anyone can read reviews
CREATE POLICY "reviews_select_all"
ON public.reviews
FOR SELECT
TO authenticated
USING (true);

-- Only clients can create reviews
CREATE POLICY "reviews_insert_clients"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'client') OR public.has_role(auth.uid(), 'admin'));

-- Users can update their own reviews; admins can update any
CREATE POLICY "reviews_update_owner_or_admin"
ON public.reviews
FOR UPDATE
TO authenticated
USING (auth.uid() = reviewer_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = reviewer_id OR public.has_role(auth.uid(), 'admin'));

-- Users can delete their own reviews; admins can delete any
CREATE POLICY "reviews_delete_owner_or_admin"
ON public.reviews
FOR DELETE
TO authenticated
USING (auth.uid() = reviewer_id OR public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();