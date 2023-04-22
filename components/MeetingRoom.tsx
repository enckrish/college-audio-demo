import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { MeetingProvider } from '@videosdk.live/react-sdk';
import { useEffect, useState } from 'react';
import MeetingView from '@/components/MeetingView';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const MeetingRoom = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { topic, room: meetingId } = router.query;
  const [email, setEmail] = useState('');
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    setAuthToken(localStorage.getItem('videosdk-auth-key') ?? '');
  }, []);

  useEffect(() => {
    async function getEmail() {
      const email =
        (await supabase.auth.getUser()).data.user?.email ?? 'AnyVoice User';
      setEmail(email);
    }
    if (supabase) getEmail();
  }, [supabase]);
  return (
    authToken &&
    meetingId && (
      <MeetingProvider
        config={{
          meetingId: Array.isArray(meetingId) ? meetingId[0] : meetingId,
          micEnabled: true,
          webcamEnabled: false,
          name: email
        }}
        token={authToken}
      >
        <MeetingView meetingId={meetingId} />
      </MeetingProvider>
    )
  );
};

export default MeetingRoom;
