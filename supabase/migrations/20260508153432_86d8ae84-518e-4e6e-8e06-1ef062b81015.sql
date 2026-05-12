-- Lock down points/streaks/goals to service-role writes only
DROP POLICY IF EXISTS "users can update own monthly points" ON public.profile_monthly_points;

DROP POLICY IF EXISTS "Users can insert their own streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can update their own streaks" ON public.user_streaks;

DROP POLICY IF EXISTS "Users can insert their own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.user_goals;