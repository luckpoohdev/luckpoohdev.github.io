import { useState } from 'react'
// next
import Head from 'next/head';
// @mui
import {
  Container,
  Grid,
  Typography,
  Divider,
  Stack,
  Button,
  IconButton,
  InputBase,
  Paper,
  alpha,
  TextField,
  MenuItem,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';
// layouts
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
// assets

import CustomButton from 'src/components/custom-button';
import useRouter from 'src/hooks/useRouter';
import Iconify from 'src/components/iconify/Iconify';
import Editor from 'src/components/ticket-editor/Editor';
import SelectBase from 'src/components/select-base';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------
  
export default function GeneralAppPage() {
  
  const router = useRouter()

  const [ category, setCategory ] = useState(null)
  const [ priority, setPriority ] = useState(null)
  const [ subject, setSubject ] = useState(null)
  const [ message, setMessage ] = useState(null)

  const handleCancelCreateNewTicket = () => {
    router.back()
  }

  const handleChangeMessage = (value: string) => {
    setMessage(value)
  };

  const handleSubjectChange = (e) => {
    setSubject(e.currentTarget.value)
  }

  const handleChangePriority = (newPriority) => {
    setPriority(newPriority)
  }

  const handleChangeCategory = (newCategory) => {
    setCategory(newCategory)
  }
  
  return (
    <>

      <Head>
        <title>PayPilot | Tickets > Opret ny</title>
      </Head>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>

        <Grid item container xs={12}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4">
              Tickets: Opret ny
            </Typography>
            <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
            Du er i gang med at oprette en support ticket
            </Typography>
          </Grid>
          <Grid item container xs={12} md={8} display="flex" justifyContent="flex-end" alignItems="center" spacing={1}>
            <CustomButton onClick={handleCancelCreateNewTicket} icon={<Iconify icon="material-symbols:close-rounded" />}>Afbryd</CustomButton>
          </Grid>
        </Grid>

        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 1.75 }}>
          <Grid item xs={12}>

            <Paper elevation={24} outlined sx={(theme) => ({ borderStyle: 'solid', borderWidth: 1, borderColor: alpha(theme.palette.grey[500], 0.16) })}>

                <SelectBase
                    placeholder="Kategori"
                    onChange={handleChangeCategory}
                    value={category}
                    valuePrefix="Kategori:"
                >
                    <MenuItem value="help">Hjælp</MenuItem>
                    <MenuItem value="request">Forespørgsel</MenuItem>
                    <MenuItem value="agreements">Aftaler</MenuItem>
                    <MenuItem value="other">Andet</MenuItem>
                </SelectBase>

                <Divider />

                <SelectBase
                    placeholder="Prioritet"
                    onChange={handleChangePriority}
                    value={priority}
                    valuePrefix="Prioritet:"
                >
                    <MenuItem value="low">Lav</MenuItem>
                    <MenuItem value="medium">Middel</MenuItem>
                    <MenuItem value="urgent">Akut</MenuItem>
                </SelectBase>

                <Divider />

                <InputBase placeholder="Emne" sx={{ px: 2, height: 40 }} fullWidth onChange={handleSubjectChange} value={subject} />

                <Divider />

                <Editor
                    simple
                    id="compose-mail"
                    value={message}
                    onChange={handleChangeMessage}
                    placeholder="Fortæl os om dit problem. I bunden af din ticket kan du vedlægge relevante skærmbilleder og/eller filer - disse kan oftest hjælpe os med at løse dit problem hurtigere..."
                    sx={{ flexGrow: 1, borderColor: 'transparent' }}
                />

                <Divider />

                <Stack direction="row" alignItems="center" sx={{ py: 2, px: 3 }}>
                    <Button variant="contained" sx={{ mr: 2, textTransform: 'none' }}>
                        Opret ticket
                    </Button>

                    <IconButton>
                        <Iconify icon="ic:round-add-photo-alternate" />
                    </IconButton>

                    <IconButton>
                        <Iconify icon="eva:attach-2-fill" />
                    </IconButton>
                </Stack>
            </Paper>

          </Grid>
        </Grid>
      </Container>
    </>
  );
}
