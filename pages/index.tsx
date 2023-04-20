import { useRouter } from 'next/router';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Center, Flex, HStack, StackDivider, Text } from '@chakra-ui/react';
import { useEffect } from 'react';

export default function Root() {
  const router = useRouter();

  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (session) router.push('/home');
  }, [router, session]);

  return (
    <HStack
      spacing={0}
      w="100%"
      h="100vh"
      divider={<StackDivider borderColor="gray.200" />}
    >
      <Flex
        direction={'column'}
        justifyContent={'space-between'}
        justifyItems={'flex-end'}
        p="2"
        w="100%"
        h="100%"
        bgImage={
          "url('https://unsplash.com/photos/crs2vlkSe98/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mjh8fGFic3RyYWN0fGVufDB8fHx8MTY4MTUzNTQwMw&force=true&w=1920')"
        }
        bgPosition={'center'}
        bgSize={'cover'}
      >
        <Text fontSize="6xl" fontWeight={'extrabold'} color="#fffa" w="80%">
          AnyVoice.
        </Text>
      </Flex>
      <Center p="5" w="40%" h="100%">
        {!session ? (
          <Auth
            supabaseClient={supabase}
            providers={['google']}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'blue',
                    brandAccent: 'darkblue'
                  }
                }
              }
            }}
            theme="light"
          />
        ) : (
          <Text>Logging in...</Text>
        )}
      </Center>
    </HStack>
  );
}
