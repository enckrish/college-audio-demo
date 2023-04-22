import { Button, Center, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export default function Root() {
  return (
    <Center h="100%">
      <VStack>
        <Text textAlign="center" fontSize={'4xl'} fontWeight={'bold'}>
          {'Talk about new things. Any day. Anywhere.'}
        </Text>
        <Link href={'/join'}>
          <Button colorScheme="blue">Join</Button>
        </Link>
      </VStack>
    </Center>
  );
}
