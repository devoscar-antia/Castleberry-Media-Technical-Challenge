
CREATE OR REPLACE FUNCTION public.ensure_user_goal(user_id_param uuid)
 RETURNS user_goals
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  goal_record public.user_goals;
BEGIN
  -- Try to get existing goal (pick the one with highest completed_posts)
  SELECT * INTO goal_record
  FROM public.user_goals
  WHERE user_id = user_id_param
  ORDER BY completed_posts DESC
  LIMIT 1;
  
  -- If no goal exists, create one with a fixed week_start
  IF NOT FOUND THEN
    INSERT INTO public.user_goals (user_id, week_start, target_posts, completed_posts)
    VALUES (user_id_param, '2025-01-06'::date, 4, 0)
    RETURNING * INTO goal_record;
  END IF;
  
  RETURN goal_record;
END;
$$;
