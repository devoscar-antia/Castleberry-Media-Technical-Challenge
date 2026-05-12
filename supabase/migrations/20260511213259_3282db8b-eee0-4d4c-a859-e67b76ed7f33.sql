-- Atomic increment of completed_posts on the user_goals row for the current week.
-- Replaces the read-modify-write pattern in update-user-progress edge function,
-- which lost increments under concurrent calls.
CREATE OR REPLACE FUNCTION public.increment_user_goal_posts(user_id_param uuid)
RETURNS public.user_goals
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  goal_record public.user_goals;
  current_week_start date;
BEGIN
  current_week_start := public.get_week_start(CURRENT_DATE);

  -- Make sure a row exists for the current week
  PERFORM public.ensure_user_goal(user_id_param);

  -- Atomic increment + return updated row
  UPDATE public.user_goals
  SET completed_posts = completed_posts + 1,
      updated_at = now()
  WHERE user_id = user_id_param
    AND week_start = current_week_start
  RETURNING * INTO goal_record;

  RETURN goal_record;
END;
$$;