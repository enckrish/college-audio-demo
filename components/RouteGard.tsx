import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
export { RouteGuard };

type ChilrenProp = { children: any };
function RouteGuard({ children }: ChilrenProp) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const session = useSession();

  const isLoggedIn = () => {
    return session != null;
  };

  useEffect(() => {
    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck);

    // on initial load - run auth check
    authCheck(router.asPath);
    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  function authCheck(url: string) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ['/', '/join'];
    const path = url.split('?')[0];
    if (!isLoggedIn() && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: '/join',
        query: { returnUrl: router.asPath }
      });
    } else {
      setAuthorized(true);
    }
  }

  return authorized && children;
}
