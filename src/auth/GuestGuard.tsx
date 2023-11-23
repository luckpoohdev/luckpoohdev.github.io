import { useEffect } from 'react';
// routes
import { PATH_APP } from '../routes/paths';
// components
import LoadingScreen from '../components/loading-screen';
//
import { useAuthContext } from './useAuthContext';
import useRouter from 'src/hooks/useRouter';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { push } = useRouter();

  const { session } = useAuthContext();

  useEffect(() => {
    if (session) {
      push(PATH_APP.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (session) {
    return <LoadingScreen />;
  }

  return <> {children} </>;
}
