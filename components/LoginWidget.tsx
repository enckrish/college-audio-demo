import { Spinner } from '@chakra-ui/react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const getCurrentLocation = () => {
  const env = process.env.NODE_ENV;
  if (env == 'development') {
    return 'http://localhost:3000';
  } else if (env == 'production') {
    return 'https://college-audio-demo.vercel.app/';
  }
};
interface ILoginWidget {
  loggedIn: boolean;
}
const LoginWidget = (props: ILoginWidget) => {
  const supabase = useSupabaseClient();
  const session = useSession();

  return !session ? (
    <Auth
      redirectTo={`${getCurrentLocation()}/home`}
      supabaseClient={supabase}
      dark={true}
      providers={['google', 'facebook']}
      socialLayout="horizontal"
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
    <Spinner />
  );
};

export default LoginWidget;
