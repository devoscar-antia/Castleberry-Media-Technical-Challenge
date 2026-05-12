-- One-time cleanup: remove platform-managed source names and non-URL entries
-- from every user's preferences.trustedMedia (Preference Sources list).
DO $$
DECLARE
  v_managed_names text[];
  v_users_changed int := 0;
  v_entries_removed int := 0;
  rec record;
  cleaned jsonb;
  before_count int;
  after_count int;
BEGIN
  -- Snapshot of platform-managed source names
  SELECT array_agg(DISTINCT name) INTO v_managed_names
  FROM public.sources
  WHERE type IN ('trusted', 'ses', 'blocked');

  FOR rec IN
    SELECT id, preferences
    FROM public.profiles
    WHERE jsonb_typeof(preferences->'trustedMedia') = 'array'
      AND jsonb_array_length(preferences->'trustedMedia') > 0
  LOOP
    -- Filter: keep only entries that look like a URL AND are not a platform-managed source name
    SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
      INTO cleaned
    FROM jsonb_array_elements_text(rec.preferences->'trustedMedia') AS elem
    WHERE
      -- must look like a URL
      (elem ~* '^https?://' OR elem ~ '\.')
      -- must NOT be a platform-managed source name
      AND NOT (elem = ANY (v_managed_names));

    before_count := jsonb_array_length(rec.preferences->'trustedMedia');
    after_count  := jsonb_array_length(cleaned);

    IF after_count <> before_count THEN
      UPDATE public.profiles
      SET preferences = jsonb_set(preferences, '{trustedMedia}', cleaned, true),
          updated_at = now()
      WHERE id = rec.id;

      v_users_changed   := v_users_changed + 1;
      v_entries_removed := v_entries_removed + (before_count - after_count);
    END IF;
  END LOOP;

  RAISE NOTICE 'trustedMedia cleanup: % users updated, % entries removed', v_users_changed, v_entries_removed;
END
$$;