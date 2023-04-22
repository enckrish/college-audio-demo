import { SupabaseClient } from '@supabase/supabase-js';

export const getAuthToken = async (supabase: SupabaseClient) => {
  let { data: authData, error: authError } = await supabase.functions.invoke(
    'videosdk',
    {
      body: { func: 'getAuthToken' }
    }
  );
  console.log('getAuthToken', authData, authError);
  if (authError) throw Error(authError);

  const authToken = authData.token;
  localStorage.setItem('videosdk-auth-key', authToken);
  return authToken;
};

export const getMeetingId = async (
  supabase: SupabaseClient,
  authToken: string
) => {
  const { data, error } = await supabase.functions.invoke('videosdk', {
    body: {
      func: 'getMeetingId',
      authToken
    }
  });
  console.log('getMeetingId', data, error);
  if (error) throw Error(error);

  const meetingId = data.meetingId;
  if (!meetingId)
    throw Error(
      'meeting-id creation failed, check validity of authorization token'
    );

  return meetingId;
};
