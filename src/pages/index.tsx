import { useEffect } from 'react';
// layouts
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// routes
import { PATH_APP } from 'src/routes/paths';
import useRouter from 'src/hooks/useRouter';

// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  const { pathname, replace, prefetch, query } = useRouter();

  useEffect(() => {
    if (pathname === PATH_APP.root) {
      replace(query.redirect ? decodeURIComponent(query.redirect) : PATH_AFTER_LOGIN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    prefetch(query.redirect ? decodeURIComponent(query.redirect) : PATH_AFTER_LOGIN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

}
