// TODO if not logged in these pages should redirect to login page
// TODO currently user gets no sign that topic is pushed

import { Button, Text, useToast } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import React, { useEffect, useState } from 'react';

import { Database } from '@/lib/database.types';
import TopicCreator from '@/components/TopicCreator';
import TopBar from '@/components/TopBar';
import AvailableTopics from '@/components/AvailableTopics';
import Link from 'next/link';
import { useRouter } from 'next/router';

let SUBSCRIBED = false;
const Home = () => {
  const supabase = useSupabaseClient<Database>();
  const toast = useToast();
  const router = useRouter();
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    const getAuthToken = async () => {
      const retrieved = localStorage.getItem('videosdk-auth-key');
      if (!retrieved) {
        let { data, error } = await supabase.functions.invoke('videosdk', {
          body: { func: 'getAuthToken' }
        });
        console.log('getAuthToken', data, error);
        if (error) throw Error(error);
        localStorage.setItem('videosdk-auth-key', data.token);
      }
    };
    if (supabase) getAuthToken();
  }, [supabase]);

  useEffect(() => {
    const acceptCall = (data: any) => {
      router.push(`/call/${data.topic}/${data.meetingId}`);
      // send acknowledgement
    };
    const subscribeToCalls = async () => {
      SUBSCRIBED = true;
      const id = (await supabase.auth.getSession()).data.session?.user.id;
      const channel = supabase.channel('calls');
      console.log('subscribing to:', {
        channel: 'calls',
        event: id as string
      });
      channel.on('broadcast', { event: id as string }, (payload) => {
        const data = payload.payload;
        toast({
          title: 'Incoming call',
          description: (
            <Button
              onClick={() => {
                toast.closeAll();
                acceptCall(data);
              }}
            >
              Accept Call
            </Button>
            // <Link href={`/call/${data.topic}/${data.meetingId}`}>
            //   <u>Go to call</u>
            // </Link>
          ),
          status: 'info',
          duration: 9000,
          isClosable: true,
          position: 'bottom-right'
        });
      });
    };
    if (supabase && !SUBSCRIBED) subscribeToCalls();
  }, [supabase]);

  return (
    <>
      <TopBar />
      <TopicCreator />

      <Text>Explore</Text>
      <AvailableTopics />
    </>
  );
};

export default Home;
