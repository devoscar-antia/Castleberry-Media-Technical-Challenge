
CREATE OR REPLACE FUNCTION public.ensure_user_goal(user_id_param uuid)
 RETURNS user_goals
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  goal_record public.user_goals;
  current_week_start date;
BEGIN
  -- Get the current week start
  current_week_start := public.get_week_start(CURRENT_DATE);
  
  -- Try to get existing goal for current week
  SELECT * INTO goal_record
  FROM public.user_goals
  WHERE user_id = user_id_param
    AND week_start = current_week_start;
  
  -- If no goal exists for this week, create one
  IF NOT FOUND THEN
    INSERT INTO public.user_goals (user_id, week_start, target_posts, completed_posts)
    VALUES (user_id_param, current_week_start, 4, 0)
    RETURNING * INTO goal_record;
  END IF;
  
  RETURN goal_record;
END;
$$;
