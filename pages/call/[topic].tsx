import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button, Text } from '@chakra-ui/react';

let MEETING_SET = false;
const CallPage = () => {
  const supabase = useSupabaseClient();
  const [meetingId, setMeetingId] = useState('');

  const router = useRouter();
  const { topic } = router.query;

  const sendNotification = async (
    meetingId: string,
    payloadRecv: (payload: any) => void
  ) => {
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
        const payload = { asker: userId as string, meetingId, topic: topic };
        const response = await channel.send({
          type: 'broadcast',
          event: author,
          payload
        });

        payloadRecv(payload);

        console.log('Message sent:', response);
      }
    });
  };

  const moveToCall = (payload: any) => {
    router.push(`/call/${payload.topic}/${payload.meetingId}`);
  };

  useEffect(() => {
    const getAuthAndMeetingId = async () => {
      let { data: authData, error: authError } =
        await supabase.functions.invoke('videosdk', {
          body: { func: 'getAuthToken' }
        });
      console.log('getAuthToken', authData, authError);
      if (authError) throw Error(authError);
      localStorage.setItem('videosdk-auth-key', authData.token);
      const { data, error } = await supabase.functions.invoke('videosdk', {
        body: {
          func: 'getMeetingId',
          authToken: authData.token
        }
      });
      console.log('getMeetingId', data, error);
      if (error) throw Error(error);
      setMeetingId(data.meetingId);
    };
    if (supabase && topic && !MEETING_SET) {
      MEETING_SET = true;
      // const _room = Array.isArray(room) ? room[0] : room ?? '';
      // setMeetingId(_room);
      // if (!room)
      getAuthAndMeetingId();
    }
  }, [supabase, topic]);

  return (
    <>
      {meetingId ? (
        <Button onClick={() => sendNotification(meetingId, moveToCall)}>
          Request Call
        </Button>
      ) : (
        <>Fetching details...</>
      )}
    </>
  );
};

export default CallPage;
