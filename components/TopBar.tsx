import { Button } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import React from 'react';

const TopBar = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  return (
    <>
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
  );
};

export default TopBar;
