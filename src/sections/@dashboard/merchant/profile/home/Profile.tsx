// @mui
import {
  Grid,
  Stack,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  CircularProgress,
} from '@mui/material';
// @types
//
import ProfileAbout from './ProfileAbout';

import { PATH_APP } from 'src/routes/paths';
import useRouter from 'src/hooks/useRouter';

// ----------------------------------------------------------------------

export default function Profile({ data }) {

  const router = useRouter()

  const viewTeam = (id) => router.push(PATH_APP.organization.teams.view(id))

  return (
    <>
      <Grid item xs={12} md={4}>
        <ProfileAbout
          email={data.email}
          phone={data.phone}
        />
      </Grid>
    </>
  );
}
