// TODO if not logged in these pages should redirect to login page
// TODO currently user gets no sign that topic is pushed

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Database } from '@/lib/database.types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  PostgrestSingleResponse,
  RealtimeChannel,
  SupabaseClient
} from '@supabase/supabase-js';

import { Box, Button, useToast } from '@chakra-ui/react';

import AvailableTopics, { TopicType } from '@/components/AvailableTopics';
import TopicCreator from '@/components/TopicCreator';
import { subscribeToCalls } from '@/lib/notificationHelpers';
import { getSessionDetails } from '@/lib/userAuthHelpers';
import { getAuthToken } from '@/lib/videoSdkHelpers';

const CALL_CHANNEL = 'calls';

interface IHomeProps {
  availableTopics: PostgrestSingleResponse<TopicType[]>;
}

const AcceptCallBar = ({}) => {
  return <Button>Accept Call</Button>;
};

const Home: NextPage<IHomeProps> = ({ availableTopics }) => {
  const supabase = useSupabaseClient<Database>();
  const [callChannel, setCallChannel] = useState<RealtimeChannel>();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (supabase) getAuthToken(supabase);
  }, [supabase]);

  type TPayload = {
    event: string;
    type: string;
    payload: { asker: string; meetingId: string; topic: string };
  };
  const getButtonDescription = (payload: TPayload) => {
    const data = payload.payload;

    const moveToCall = async () => {
      toast.closeAll();
      router.push(`/call/${data.topic}/${data.meetingId}`);
    };
    return <Button onClick={moveToCall}>Accept</Button>;
  };
  useEffect(() => {
    if (
      supabase
      // && !getCallReceiveListener().enabled
    ) {
      // setCallReceiveListener({ enabled: true });
      const channel = supabase.channel(CALL_CHANNEL).subscribe((status) => {
        if (status == 'SUBSCRIBED') console.log('SUBSCRIBED');
        if (status == 'CHANNEL_ERROR') throw Error('CHANNEL_ERROR');
      });

      const setupBroadcast = async () => {
        const userId = (await getSessionDetails(supabase))?.user.id;
        subscribeToCalls(
          channel,
          userId as string,
          router,
          toast,
          getButtonDescription
        );
      };

      setCallChannel(channel);
      setupBroadcast();
    }
  }, [supabase]);

  useEffect(() => {}, [supabase]);

  return (
    <Box>
      <TopicCreator />
      <AvailableTopics availableTopics={availableTopics} />
    </Box>
  );
};

// Load all topics from database
Home.getInitialProps = async (ctx) => {
  const supabase = new SupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );

  const availableTopics = await supabase.from('topicrequests').select('*');
  return {
    availableTopics: availableTopics as PostgrestSingleResponse<TopicType[]>
  };
};

export default Home;
