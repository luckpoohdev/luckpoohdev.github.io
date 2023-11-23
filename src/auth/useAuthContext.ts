
// ----------------------------------------------------------------------

import useSession from 'src/hooks/useSession'

export const useAuthContext = () => {
  const session = useSession();

  if (!session) throw new Error('useAuthContext context must be use inside a SessionProvider');

  return session;
};
