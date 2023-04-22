import { Database } from '@/lib/database.types';
import { Button, Center, Text } from '@chakra-ui/react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const HeaderBar = () => {
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();
  const session = useSession();

  return (
    <Center h="80px">
      <Link href="/home">Home</Link>
      {session && (
        <Button
          colorScheme="red"
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/');
          }}
        >
          Sign Out
        </Button>
      )}
      <Text>HeyHey</Text>
    </Center>
  );
};

export default HeaderBar;
