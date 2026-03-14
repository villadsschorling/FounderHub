-- Simple schema update for subscription_status column

-- 1. Add subscription_status column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive' 
CHECK (subscription_status IN ('active', 'inactive'));

-- 2. Update existing owner profile to have active subscription
UPDATE public.profiles 
SET subscription_status = 'active'
WHERE user_id IN (
  SELECT id FROM auth.users WHERE LOWER(email) = 'founderhub26@gmail.com'
);

-- 3. Update the handle_new_user function to set subscription_status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, subscription_status)
  VALUES (
    NEW.id, 
    SPLIT_PART(NEW.email, '@', 1),
    CASE 
      WHEN LOWER(NEW.email) = 'founderhub26@gmail.com' THEN 'active'
      ELSE 'inactive'
    END
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Note: The trigger should already exist, but if you need to recreate it:
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();