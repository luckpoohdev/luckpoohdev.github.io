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
} from '@mui/material';
// @types
import { IUserProfile, IUserProfilePost } from '../../../../../@types/user';
//
import ProfileAbout from './ProfileAbout';
import ProfilePostCard from './ProfilePostCard';
import ProfilePostInput from './ProfilePostInput';
import ProfileFollowInfo from './ProfileFollowInfo';
import ProfileSocialInfo from './ProfileSocialInfo';

import { PATH_APP } from 'src/routes/paths';
import useRouter from 'src/hooks/useRouter';

// ----------------------------------------------------------------------

type Props = {
  info: IUserProfile;
  posts: IUserProfilePost[];
};

export default function Profile({ info }: Props) {

  const router = useRouter()

  const viewTeam = (id) => router.push(PATH_APP.organization.teams.view(id))

  return (
    <>
      <Grid item xs={12} md={4}>
        <ProfileAbout
          description={info.description}
          country={info.country}
          email={info.email}
          phone={info.phone}
          company={info.company}
          profession={info.profession}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Manager af" />
          <CardContent>
            {info?.manager_of_teams?.length ? (
              <List>
                {info?.manager_of_teams?.map((team, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => viewTeam(team.id)}>
                      <ListItemIcon>
                        <Avatar src={team.avatarUrl} />
                      </ListItemIcon>
                      <ListItemText primary={team.name} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2">Denne bruger er ikke manager af nogle teams endnu.</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Medlem af" />
          <CardContent>
          {info?.member_of_teams?.length ? (
              <List>
                {info?.member_of_teams?.map((team, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => viewTeam(team.id)}>
                      <ListItemIcon>
                        <Avatar src={team.avatarUrl} />
                      </ListItemIcon>
                      <ListItemText primary={team.name} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2">Denne bruger er ikke medlem af nogle teams endnu.</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}
