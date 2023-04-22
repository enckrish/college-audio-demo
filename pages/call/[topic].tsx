import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { TopicType } from '@/components/AvailableTopics';
import { Database } from '@/lib/database.types';
import { sendJoinRequest } from '@/lib/notificationHelpers';
import { getSessionDetails } from '@/lib/userAuthHelpers';
import { getAuthToken, getMeetingId } from '@/lib/videoSdkHelpers';
import {
  Button,
  Center,
  HStack,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextPage } from 'next';

interface ICallPage {
  topicDetails: TopicType;
}

enum CallExecuteState {
  IDLE,
  STARTED,
  ROOM_CREATED,
  WAITING,
  ACCEPTED
}
const CallPage: NextPage<ICallPage> = ({ topicDetails }) => {
  const [executeStage, setExecuteStage] = useState(CallExecuteState.IDLE);

  const supabase = useSupabaseClient<Database>();
  const router = useRouter();

  const executeCallProcess = async () => {
    setExecuteStage(CallExecuteState.STARTED);

    const authToken = await getAuthToken(supabase);
    const meetingId = await getMeetingId(supabase, authToken);
    setExecuteStage(CallExecuteState.ROOM_CREATED);

    sendJoinRequest(supabase, topicDetails, meetingId, waitForCallAccept);
  };

  const waitForCallAccept = async () => {
    setExecuteStage(CallExecuteState.WAITING);
  };

  const moveToCall = async (payload: any) => {
    const userId = (await getSessionDetails(supabase))?.user.id;
    router.push(
      `/call/${payload.topic}/${payload.meetingId}`,
      `/call/${payload.topic}/${userId}`
    );
  };

  const getButtonTextByStage = () => {
    switch (executeStage) {
      case CallExecuteState.IDLE:
        return 'Request Call';
      case CallExecuteState.STARTED:
        return 'Connecting';
      case CallExecuteState.ROOM_CREATED:
      case CallExecuteState.WAITING:
        return 'Request sent, waiting...';
      case CallExecuteState.ACCEPTED:
        return 'Accepted';
    }
  };

  return (
    <Center h="100%" w="100%">
      <VStack w="80%">
        <Text fontSize={'2xl'}>{topicDetails.topic}</Text>
        <Text>{topicDetails.description ?? 'Umm...no description :('} </Text>
        <Button w="full" onClick={executeCallProcess}>
          <HStack spacing={'4'}>
            {executeStage > CallExecuteState.IDLE && <Spinner />}
            <Text>{getButtonTextByStage()}</Text>
          </HStack>
        </Button>
      </VStack>
    </Center>
  );
};
CallPage.getInitialProps = async (ctx) => {
  const topic = ctx.query.topic;

  const supabase = new SupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );

  const { data: topicDetails_, error } = await supabase
    .from('topicrequests')
    .select('*')
    .filter('id', 'eq', topic);
  if (error) throw error;
  const topicDetails = topicDetails_[0] as TopicType;
  return { topicDetails };
};
export default CallPage;
