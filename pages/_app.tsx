import '@/styles/globals.css';

import { Box, ChakraProvider, Stack, StackDivider } from '@chakra-ui/react';
import { AppProps } from 'next/app';

import HeaderBar from '@/components/HeaderBar';
import { Database } from '@/lib/database.types';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { RouteGuard } from '@/components/RouteGard';

function MyApp({
  Component,
  pageProps
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ChakraProvider>
        {/* <RouteGuard> */}
        <Stack h="100vh" w="100%" spacing={'0'} divider={<StackDivider />}>
          <HeaderBar />
          <Box h="100%">
            {/* Parent component here to get authToken and check etc. */}
            <Component {...pageProps} />
          </Box>
        </Stack>
        {/* </RouteGuard> */}
      </ChakraProvider>
    </SessionContextProvider>
  );
}
export default MyApp;
