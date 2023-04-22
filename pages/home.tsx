// TODO if not logged in these pages should redirect to login page
// TODO currently user gets no sign that topic is pushed

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

import { Button, Text, useToast } from '@chakra-ui/react';

import AvailableTopics, { TopicType } from '@/components/AvailableTopics';
import TopicCreator from '@/components/TopicCreator';
import { getSessionDetails } from '@/lib/userAuthHelpers';
import { getAuthToken } from '@/lib/videoSdkHelpers';

let SUBSCRIBED = false;
interface IHomeProps {
  availableTopics: PostgrestSingleResponse<TopicType[]>;
}
const Home: NextPage<IHomeProps> = ({ availableTopics }) => {
  const supabase = useSupabaseClient<Database>();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (supabase) getAuthToken(supabase);
  }, [supabase]);

  useEffect(() => {
    const acceptCall = (data: any) => {
      router.push(`/call/${data.topic}/${data.meetingId}`);
      // send acknowledgement
    };
    const subscribeToCalls = async () => {
      SUBSCRIBED = true;
      const id = (await getSessionDetails(supabase))?.user.id;
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
      <TopicCreator />
      <AvailableTopics availableTopics={availableTopics} />
    </>
  );
};

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
