
ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available',
  ADD COLUMN IF NOT EXISTS tagline TEXT;

CREATE TABLE public.member_works (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.member_works ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view works" ON public.member_works FOR SELECT USING (true);
CREATE POLICY "Anyone can insert works" ON public.member_works FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update works" ON public.member_works FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete works" ON public.member_works FOR DELETE USING (true);

CREATE TABLE public.member_socials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.member_socials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view socials" ON public.member_socials FOR SELECT USING (true);
CREATE POLICY "Anyone can insert socials" ON public.member_socials FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update socials" ON public.member_socials FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete socials" ON public.member_socials FOR DELETE USING (true);

CREATE TABLE public.member_experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL,
  title TEXT NOT NULL,
  company TEXT,
  start_year INTEGER,
  end_year INTEGER,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.member_experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view experience" ON public.member_experience FOR SELECT USING (true);
CREATE POLICY "Anyone can insert experience" ON public.member_experience FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update experience" ON public.member_experience FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete experience" ON public.member_experience FOR DELETE USING (true);

CREATE TABLE public.member_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  project_type TEXT,
  budget TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.member_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view bookings" ON public.member_bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert bookings" ON public.member_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update bookings" ON public.member_bookings FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete bookings" ON public.member_bookings FOR DELETE USING (true);
