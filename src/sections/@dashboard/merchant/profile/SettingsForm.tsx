import { useEffect } from 'react'
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
  Button,
} from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form'
// @types
//


import { PATH_APP } from 'src/routes/paths';
import useRouter from 'src/hooks/useRouter';

import { RHFAutocomplete, RHFCountrySelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  info: IUserProfile;
  posts: IUserProfilePost[];
};

import { _teamList } from 'src/_mock/arrays';
const flattenTeamList = (teams, level = 0) => teams.reduce((ret, _team) => {
  const team = JSON.parse(JSON.stringify(_team))
  const subTeams = team.sub_teams
  delete team.sub_teams
  team.level = level
  ret.push(team)
  if (subTeams) {
    ret = ret.concat(flattenTeamList(subTeams, level+1))
  }
  return ret
}, [])

const teamList = flattenTeamList(_teamList)

const teamOptions = teamList.map((team) => ({
  value: team.id,
  label: team.name,
  avatarUrl: team.avatarUrl,
}))

export default function UserForm({ data }: Props) {

  const router = useRouter()

  const viewTeam = (id) => router.push(PATH_APP.organization.teams.view(id))

  const methods = useForm()

  useEffect(() => {
    methods.reset({

    })
  }, [])

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <FormProvider {...methods}>
            <Grid container rowSpacing={3} columnSpacing={2}>
              <Grid item xs={12} md={6}><RHFTextField name="firstname" label="Fornavn" /></Grid>
              <Grid item xs={12} md={6}><RHFTextField name="surname" label="Efternavn" /></Grid>
              <Grid item xs={12} md={6}><RHFTextField name="phone" label="Telefonnummer" /></Grid>
              <Grid item xs={12} md={6}><RHFTextField name="email" label="Email" /></Grid>
              <Grid item xs={12} md={6}><RHFCountrySelect name="country" label="Land" /></Grid>
              <Grid item xs={12} md={6}><RHFCountrySelect name="language" label="Sprog" /></Grid>
              <Grid item xs={12} md={6}><RHFTextField name="password" label="Adgangskode" type="password" /></Grid>
              <Grid item xs={12} md={6}><RHFTextField name="confirm_password" label="Ny adgangskode" type="password" /></Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end">
                  <Button type="submit" variant="contained">Gem indstillinger</Button>
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </CardContent>
      </Card>
    </Grid>
  );
}
