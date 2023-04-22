import { SupabaseClient } from '@supabase/supabase-js';

export const getSessionDetails = async (supabase: SupabaseClient) => {
  const res = await supabase.auth.getSession();
  if (res.error) throw res.error;
  else return res.data.session;
};
