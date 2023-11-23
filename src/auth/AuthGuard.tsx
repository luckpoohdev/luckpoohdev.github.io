import { useState, useEffect } from 'react';

// auth
import { signIn, getSession } from 'next-auth/react'

// components
import LoadingScreen from '../components/loading-screen';
//
import Login from '../pages/auth/login';

import useSession from 'src/hooks/useSession'
import useRouter from 'src/hooks/useRouter';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { session, status } = useSession()
  const isUser = !!session?.user

  const { pathname, push } = useRouter();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  useEffect(() => {
    if (requestedLocation && pathname !== requestedLocation) {
      push(requestedLocation);
    }
    if (isUser) {
      setRequestedLocation(null);
    }
  }, [isUser, pathname, push, requestedLocation]);

  if (!isMounted) {
    return <LoadingScreen />;
  }
  
  if (!isUser) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  return <> {children} </>;
}
