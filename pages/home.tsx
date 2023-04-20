// TODO if not logged in these pages should redirect to login page
// TODO currently user gets no sign that topic is pushed

import { Text, useToast } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import React, { useEffect, useState } from 'react';

import { Database } from '@/lib/database.types';
import TopicCreator from '@/components/TopicCreator';
import TopBar from '@/components/TopBar';
import AvailableTopics from '@/components/AvailableTopics';
import Link from 'next/link';

let SUBSCRIBED = false;
const Home = () => {
  const supabase = useSupabaseClient<Database>();
  const toast = useToast();

  useEffect(() => {
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
            <Link href={`/call/${data.topic}/${data.meetingId}`}>
              Go to call
            </Link>
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
