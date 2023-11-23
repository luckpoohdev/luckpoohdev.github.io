// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack } from '@mui/material';
// @types
import { IUserProfileAbout } from '../../../../../@types/user';
// components
import Icon from 'src/components/Icon';

export default function ProfileAbout({
  description,
  country,
  email,
  phone,
  profession,
}: IUserProfileAbout) {
  return (
    <Card>

      <CardHeader title="Om" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body2">{description}</Typography>

        <Stack direction="row" spacing={2}>
          <Icon name="ic_pin" />
          <Typography variant="body2">{country}</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Icon name="ic_mail" />
          <Typography variant="body2">{email}</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Icon name="ic_call" />
          <Typography variant="body2">{phone}</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Icon name="ic_job" />
          <Typography variant="body2">{profession}</Typography>
        </Stack>

      </Stack>
    </Card>
  );
}
