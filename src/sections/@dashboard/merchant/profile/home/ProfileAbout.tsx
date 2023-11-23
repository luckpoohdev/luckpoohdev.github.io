// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack } from '@mui/material';
// @types
// components
import Icon from 'src/components/Icon';

export default function ProfileAbout({
  email,
  phone,
}) {
  return (
    <Card>

      <CardHeader title="Om" />

      <Stack spacing={2} sx={{ p: 3 }}>

        <Stack direction="row" spacing={2}>
          <Icon name="ic_mail" />
          <Typography variant="body2">{email}</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Icon name="ic_call" />
          <Typography variant="body2">{phone}</Typography>
        </Stack>

      </Stack>
    </Card>
  );
}
