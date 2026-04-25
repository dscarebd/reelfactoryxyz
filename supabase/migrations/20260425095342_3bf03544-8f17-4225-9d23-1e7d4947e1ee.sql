
-- Team members
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  photo_url TEXT,
  skills TEXT[] DEFAULT '{}',
  phone TEXT,
  email TEXT,
  bio TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Anyone can insert team members" ON public.team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update team members" ON public.team_members FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete team members" ON public.team_members FOR DELETE USING (true);

-- Member reviews
CREATE TABLE public.member_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.member_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.member_reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reviews" ON public.member_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update reviews" ON public.member_reviews FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete reviews" ON public.member_reviews FOR DELETE USING (true);

-- Member FAQs
CREATE TABLE public.member_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.member_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view faqs" ON public.member_faqs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert faqs" ON public.member_faqs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update faqs" ON public.member_faqs FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete faqs" ON public.member_faqs FOR DELETE USING (true);

-- Contact submissions
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view contact" ON public.contact_submissions FOR SELECT USING (true);
CREATE POLICY "Anyone can delete contact" ON public.contact_submissions FOR DELETE USING (true);

-- Storage bucket for team photos
INSERT INTO storage.buckets (id, name, public) VALUES ('team-photos', 'team-photos', true);

CREATE POLICY "Public read team photos" ON storage.objects FOR SELECT USING (bucket_id = 'team-photos');
CREATE POLICY "Anyone can upload team photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'team-photos');
CREATE POLICY "Anyone can update team photos" ON storage.objects FOR UPDATE USING (bucket_id = 'team-photos');
CREATE POLICY "Anyone can delete team photos" ON storage.objects FOR DELETE USING (bucket_id = 'team-photos');
