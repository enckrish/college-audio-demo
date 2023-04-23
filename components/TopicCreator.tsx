import {
  Button,
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input
} from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import React, { useState } from 'react';

const TopicCreator = () => {
  const [topic, setTopic] = useState('');
  const supabase = useSupabaseClient();

  const handleInputChange = (e: any) => setTopic(e.target.value);
  const isTopicValidUI = () => {
    return topic.length === 0 || !submitDisable();
  };

  const submitDisable = () => {
    return topic.length < 3;
  };

  const submitRequest = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (topic.length > 10) {
      const res = await supabase.from('topicrequests').insert([{ topic }]);
    }
    setTopic('');
  };
  return (
    <Box
      p="5"
      m="2"
      border={'1px'}
      borderColor="gray.200"
      w="fit-content"
      rounded="2xl"
    >
      <form onSubmit={(e) => submitRequest(e)}>
        <FormControl isInvalid={!isTopicValidUI()} w="300px">
          <FormLabel>Topic</FormLabel>
          <FormHelperText mb="2">
            {'Enter the topic to talk about'}
          </FormHelperText>
          <Input type="text" value={topic} onChange={handleInputChange} />
          {isTopicValidUI() ? (
            <></>
          ) : (
            <FormErrorMessage>Topic is required.</FormErrorMessage>
          )}
        </FormControl>
        <Button type="submit" mt="5" isDisabled={submitDisable()}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default TopicCreator;
