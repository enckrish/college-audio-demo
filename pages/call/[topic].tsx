import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant
} from '@videosdk.live/react-sdk';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import CallView from '@/components/CallView';

let MEETING_SET = false;
const CallPage = () => {
  const supabase = useSupabaseClient();
  const [meetingId, setMeetingId] = useState('');
  const [authToken, setAuthToken] = useState('');

  const router = useRouter();
  const { topic } = router.query;

  useEffect(() => {
    const sendNotification = async (meetingId: string) => {
      const channel = supabase.channel('calls');
      const userId = (await supabase.auth.getUser()).data.user?.id;

      const { data: author_, error } = await supabase
        .from('topicrequests')
        .select('author')
        .filter('id', 'eq', topic);
      if (error) throw error;
      const author = author_[0].author;

      console.log('Sending message:', {
        channel: 'calls',
        type: 'broadcast',
        event: author,
        payload: { asker: userId, meetingId }
      });
      channel.subscribe(async (status) => {
        if (status == 'SUBSCRIBED') {
          const response = await channel.send({
            type: 'broadcast',
            event: author,
            payload: { asker: userId as string, meetingId, topic: topic }
          });

          console.log('Message sent:', response);
        }
      });
    };
    const getAuthAndMeetingId = async () => {
      // Check if AuthToken is available and valid
      // else create new
      let token = null;
      {
        let { data, error } = await supabase.functions.invoke('videosdk', {
          body: { func: 'getAuthToken' }
        });
        console.log('getAuthToken', data, error);
        if (error) throw Error(error);
        token = data.token;
        setAuthToken(token);
      }
      const { data, error } = await supabase.functions.invoke('videosdk', {
        body: { func: 'getMeetingId', authToken: token }
      });
      console.log('getMeetingId', data, error);
      if (error) throw Error(error);
      setMeetingId(data.meetingId);
      sendNotification(data.meetingId);
    };
    if (supabase && topic && !MEETING_SET) {
      MEETING_SET = true;
      getAuthAndMeetingId();
    }
  }, [supabase, topic]);

  const onMeetingLeave = () => {
    setMeetingId('');
  };

  return meetingId && authToken ? (
    <div>
      {`Call ID: ${topic}`}
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: true,
          webcamEnabled: false,
          name: 'AnyVoice User'
        }}
        token={authToken}
      >
        <CallView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
      </MeetingProvider>
    </div>
  ) : (
    <>Fetching details...</>
  );
};

export default CallPage;
