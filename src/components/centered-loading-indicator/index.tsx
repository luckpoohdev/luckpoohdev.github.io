import { Stack, CircularProgress } from '@mui/material';

const CenteredLoadingIndicator = ({ height }) => (
    <Stack sx={{ width: 'calc(100vw - 360px)', height: height ? height : 'calc(100vh - 220px)' }} justifyContent="center" alignItems="center">
      <CircularProgress />
    </Stack>
  );

  export default CenteredLoadingIndicator;