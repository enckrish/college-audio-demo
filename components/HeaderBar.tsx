import { Database } from '@/lib/database.types';
import { Button, Center, HStack, Text } from '@chakra-ui/react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BsHouse } from 'react-icons/bs';

const HeaderBar = () => {
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();
  const session = useSession();

  return (
    <Center w="100%" p="2">
      <HStack>
        {session ? (
          <>
            <Link href="/home">
              <BsHouse />
            </Link>
            <Button
              colorScheme="red"
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/');
              }}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <Text fontFamily={'fantasy'}>AnyVoice</Text>
        )}
      </HStack>
    </Center>
  );
};

export default HeaderBar;
