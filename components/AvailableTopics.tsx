import { Database } from '@/lib/database.types';
import { Box, HStack, SimpleGrid } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import TopicCard from './TopicCard';
import { NextPage } from 'next';

export type TopicType = {
  author: string;
  created_at: string;
  description: string | null;
  expire_at: string | null;
  id: string;
  topic: string;
};
interface IAvailableTopics {
  availableTopics: PostgrestSingleResponse<TopicType[]>;
}

const AvailableTopics: NextPage<IAvailableTopics> = ({ availableTopics }) => {
  const [id, setId] = useState<string | undefined>(undefined);
  const supabase = useSupabaseClient<Database>();

  useEffect(() => {
    supabase.auth.getSession().then((res) => setId(res.data.session?.user.id));
  }, [supabase]);
  return (
    <SimpleGrid minChildWidth={'210px'} spacing="10px" p="10px">
      {availableTopics ? (
        availableTopics.data?.map((info) => {
          if (info.author != id)
            return <TopicCard key={info.id} id={info.id} topic={info.topic} />;
        })
      ) : (
        <></>
      )}
    </SimpleGrid>
  );
};

export default AvailableTopics;
