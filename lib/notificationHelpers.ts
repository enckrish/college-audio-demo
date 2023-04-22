import { TopicType } from '@/components/AvailableTopics';
import { SupabaseClient } from '@supabase/supabase-js';

export const sendJoinRequest = async (
  supabase: SupabaseClient,
  topicDetails: TopicType,
  meetingId: string,
  payloadRecv: (payload: any) => void
) => {
  const channel = supabase.channel('calls');
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const author = topicDetails.author;
  console.log('Sending message:', {
    channel: 'calls',
    type: 'broadcast',
    event: author,
    payload: { asker: userId, meetingId }
  });
  channel.subscribe(async (status) => {
    if (status == 'SUBSCRIBED') {
      const payload = {
        asker: userId as string,
        meetingId,
        topic: topicDetails.id
      };
      const response = await channel.send({
        type: 'broadcast',
        event: author,
        payload
      });

      payloadRecv(payload);

      console.log('Message sent:', response);
      channel.unsubscribe();
    }
  });
};
