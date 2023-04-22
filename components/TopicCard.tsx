import {
  Box,
  HStack,
  Spacer,
  StyleProps,
  Text,
  VStack
} from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';

const TopicCard = ({
  id,
  topic,
  timestamp
}: {
  id: string;
  topic: string;
  timestamp: number;
}) => {
  const [expired, setExpired] = useState(false);

  const timestampToReadable = (ts: number) => {
    const elapsed = Date.now() - ts;
    if (elapsed <= 0) return 'just now';
    // if (seconds > 30 && !expired) setExpired(true);

    let secString, minuteString, hourString, dayString;
    const seconds = Math.trunc(elapsed / 1000);
    if (seconds) secString = `${seconds} second(s)`;

    const minutes = Math.trunc(seconds / 60);
    if (minutes) minuteString = `${minutes} minute(s)`;

    const hours = Math.trunc(minutes / 60);
    if (hours) hourString = `${hours} hour(s)`;

    const days = Math.trunc(hours / 24);
    if (days) dayString = `${days} day(s)`;

    const out = dayString || hourString || minuteString || secString;
    return out + ' ago';
  };
  return (
    <Box
      // width={'200px'}
      rounded="xl"
      style={{ aspectRatio: '1' }}
      border="2px"
      borderColor="white"
      bgGradient="linear(to-tr, gray.100, gray.200)"
      _hover={{
        bgGradient: 'linear(to-tr, blue, blue.400)',
        textColor: 'white'
      }}
    >
      <Link href={`/call/${id}`}>
        <VStack p="5" h="100%" alignItems={'flex-start'}>
          <Text fontSize={'3xl'} noOfLines={2}>
            {topic}
          </Text>
          <Spacer />
          <HStack>
            {/* <Text textTransform={'uppercase'}>{`Posted ${timestampToReadable(
              timestamp
            )}`}</Text> */}
            {/* <Text textTransform={'uppercase'}>Posted 9 mins ago</Text> */}
          </HStack>
        </VStack>
      </Link>
    </Box>
  );
};
TopicCard.defaultProps = {
  id: 'ILLEGAL',
  topic: "Let's talk about colleges and education",
  timestamp: Date.now() - 5000
};
export default TopicCard;
