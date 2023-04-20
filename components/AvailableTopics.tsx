import { Database } from '@/lib/database.types';
import { SimpleGrid } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import TopicCard from './TopicCard';

type TopicType = {
  author: string;
  created_at: string;
  description: string | null;
  expire_at: string | null;
  id: string;
  topic: string;
};

const AvailableTopics = () => {
  const supabase = useSupabaseClient<Database>();

  const [availableTopics, setAvailableTopics] =
    useState<PostgrestSingleResponse<TopicType[]>>();

  useEffect(() => {
    if (supabase) {
      const updateTopics = async () => {
        const id = (await supabase.auth.getSession()).data.session?.user.id;
        const othersFetched = await supabase
          .from('topicrequests')
          .select('*')
          .filter('author', 'not.eq', id);
        setAvailableTopics(othersFetched);
      };
      updateTopics();
    }
  }, [supabase]);
  return (
    <SimpleGrid minChildWidth="320px" gap="5" w="100%" p="5">
      {availableTopics ? (
        availableTopics.data?.map((info) => (
          <TopicCard key={info.id} id={info.id} topic={info.topic} />
        ))
      ) : (
        <></>
      )}
    </SimpleGrid>
  );
};

export default AvailableTopics;
