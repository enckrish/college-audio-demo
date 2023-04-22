import { useRouter } from 'next/router';

import LoginWidget from '@/components/LoginWidget';
import { Center } from '@chakra-ui/react';
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';

export default function Join() {
  const router = useRouter();

  const session = useSession();

  useEffect(() => {
    if (session) router.push('/home');
  }, [router, session]);

  return (
    <Center h="100%">
      <LoginWidget loggedIn={session != null} />
    </Center>
  );
}
