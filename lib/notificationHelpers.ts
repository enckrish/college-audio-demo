import { TopicType } from '@/components/AvailableTopics';
import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { getSessionDetails } from './userAuthHelpers';
import { CreateToastFnReturn } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { NextRouter } from 'next/router';

export const subscribeToCalls = async (
  channel: RealtimeChannel,
  userId: string,
  router: NextRouter,
  toast: CreateToastFnReturn,
  descrFn: (payload: any) => ReactNode
) => {
  console.log('subChannel:', channel, userId);

  channel.on('broadcast', { event: userId }, (payload) => {
    console.log('Event data:', payload);

    const data = payload.payload;
    if (!data.ack)
      toast({
        title: 'Incoming call',
        description: descrFn(payload),
        status: 'info',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right'
      });
    else {
      router.push(data.path);
    }
  });
};

export const testSubscribe = async (channel: RealtimeChannel) => {
  const res = await channel.send({
    type: 'broadcast',
    event: 'supa',
    payload: { org: 'supabase' }
  });
};

export const testListen = async (
  channel: RealtimeChannel,
  toast: CreateToastFnReturn
) => {
  channel.on('broadcast', { event: 'supa' }, (payload: any) => {
    console.log('supatest:', payload);
    toast({
      title: 'Incoming call',
      description: JSON.stringify(payload),
      status: 'info',
      duration: 9000,
      isClosable: true,
      position: 'bottom-right'
    });
  });
};

export const getTopicToChannel = (supabase: SupabaseClient) => {
  const channel = supabase.channel('calls').subscribe((status) => {
    if (status == 'SUBSCRIBED') console.log('ToChannel: SUBSCRIBED');
    if (status == 'CHANNEL_ERROR') throw Error('ToChannel: CHANNEL_ERROR');
  });

  return channel;
};

export const sendJoinRequest = async (
  channel: RealtimeChannel,
  userId: string,
  topicDetails: TopicType,
  meetingId: string,
  payloadRecv: (payload: any) => void
) => {
  const author = topicDetails.author;
  const payload = {
    asker: userId as string,
    meetingId,
    topic: topicDetails.id
  };

  console.log('toChannel:', channel, author);

  const response = await channel.send({
    type: 'broadcast',
    event: author,
    payload
  });

  console.log('Request status:', response);

  payloadRecv(payload);
};
