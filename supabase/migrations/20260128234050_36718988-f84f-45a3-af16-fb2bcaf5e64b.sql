-- Create role enum
CREATE TYPE public.app_role AS ENUM ('worker', 'agency', 'admin');

-- Create profiles table (stores common profile info)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create worker_profiles table (worker-specific data)
CREATE TABLE public.worker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  primary_skill TEXT,
  experience_years INTEGER DEFAULT 0,
  languages TEXT[] DEFAULT '{}',
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'selected', 'visa_processing', 'placed', 'unavailable')),
  desired_salary_min INTEGER,
  desired_salary_max INTEGER,
  cv_url TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create agency_profiles table (agency-specific data)
CREATE TABLE public.agency_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  position TEXT,
  country TEXT NOT NULL,
  business_email TEXT,
  business_phone TEXT,
  website TEXT,
  description TEXT,
  is_verified BOOLEAN DEFAULT false,
  verification_documents TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_profiles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own role during signup"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for worker_profiles
CREATE POLICY "Workers can view own profile"
  ON public.worker_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Agencies can view worker profiles"
  ON public.worker_profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'agency'));

CREATE POLICY "Admins can view all worker profiles"
  ON public.worker_profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Workers can insert own profile"
  ON public.worker_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'worker'));

CREATE POLICY "Workers can update own profile"
  ON public.worker_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for agency_profiles
CREATE POLICY "Agencies can view own profile"
  ON public.agency_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Workers can view verified agency profiles"
  ON public.agency_profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'worker') AND is_verified = true);

CREATE POLICY "Admins can view all agency profiles"
  ON public.agency_profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Agencies can insert own profile"
  ON public.agency_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'agency'));

CREATE POLICY "Agencies can update own profile"
  ON public.agency_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_worker_profiles_updated_at
  BEFORE UPDATE ON public.worker_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agency_profiles_updated_at
  BEFORE UPDATE ON public.agency_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();