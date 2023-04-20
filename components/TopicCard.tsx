import {
  Box,
  Button,
  HStack,
  IconButton,
  Spacer,
  StyleProps,
  Text,
  VStack
} from '@chakra-ui/react';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle
} from 'react-icons/io';

const colors = [
  'red.100',
  'blue.100',
  'cyan.100',
  'pink.100',
  'orange.100',
  'purple.100',
  'teal.100',
  'yellow.100',
  'green.100'
];

const TopicCard = ({
  id,
  topic,
  timestamp,
  boxStyle
}: {
  id: string;
  topic: string;
  timestamp: number;
  boxStyle: StyleProps;
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

  const getBoxColor = () => {
    const index = Number('0x' + id.slice(0, 2)) % colors.length;
    return colors[index];
  };
  return (
    <Box
      {...boxStyle}
      style={{ aspectRatio: '2' }}
      bgColor={expired ? 'gray' : getBoxColor()}
    >
      <Link href={`/call/${id}`}>
        <VStack p="5" h="100%" alignItems={'flex-start'}>
          <Text fontSize={'3xl'} fontWeight={'bold'} noOfLines={2}>
            {topic}
          </Text>
          <Spacer />
          <HStack>
            {/* <Text textTransform={'uppercase'}>{`Posted ${timestampToReadable(
              timestamp
            )}`}</Text> */}
            <Text textTransform={'uppercase'}>Posted 9 mins ago</Text>
          </HStack>
        </VStack>
      </Link>
    </Box>
  );
};
const defaultBoxStyle: StyleProps = {
  w: '70',
  bgColor: 'beige',
  rounded: 'xl'
  // boxShadow: 'xl'
};
TopicCard.defaultProps = {
  id: 'ILLEGAL',
  topic: "Let's talk about colleges and education",
  timestamp: Date.now() - 5000,
  boxStyle: defaultBoxStyle
};
export default TopicCard;
