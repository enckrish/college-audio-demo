import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { Database } from '@/lib/database.types';
import dynamic from 'next/dynamic';

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
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionContextProvider>
  );
}
// export default dynamic(() => Promise.resolve(MyApp), {
//   ssr: false
// });

export default MyApp;
