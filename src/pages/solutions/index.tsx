// react
import { useState } from 'react'
// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Stack,
  Avatar,
  AvatarGroup,
  CircularProgress,
  Box,
} from '@mui/material';
// auth
import { useAuthContext } from 'src/auth/useAuthContext';
// layouts
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
// _mock_
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from 'src/_mock/arrays';
// components
import { useSettingsContext } from 'src/components/settings';
// sections
import {
    AppWidget,
    AppWelcome,
    AppFeatured,
    AppNewInvoice,
    AppTopAuthors,
    AppTopRelated,
    AppAreaInstalled,
    AppWidgetSummary,
    AppCurrentDownload,
    AppTopInstalledCountries,
} from 'src/sections/@dashboard/general/app';
// assets
import { SeoIllustration } from 'src/assets/illustrations';

import { useSelector } from 'src/redux/store';
import usePopover from 'src/hooks/usePopover';
import CustomButton from 'src/components/custom-button';
import MenuItem from '@mui/material/MenuItem';
import MoreActionsButton from 'src/components/more-actions-button';
import Iconify from 'src/components/iconify/Iconify';

import { fPercent } from 'src/utils/formatNumber';
import { PATH_APP } from 'src/routes/paths';
import Dialog from 'src/components/custom-dialog';

import useRouter from 'src/hooks/useRouter';
import useConfirmDialog from 'src/hooks/useConfirmDialog';
import { useQuery } from 'src/hooks/apollo';

import { GET_SOLUTIONS } from 'src/queries/solution';

import img from 'src/utils/img';
import CenteredLoadingIndicator from '@/components/centered-loading-indicator';



// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

const NewSolutionFormDialog = ({ type, onClose, onSave }) => {
  return (
    <Dialog
      open={Boolean(type)}
      maxWidth="lg"
      onClose={onClose}
      title={`Opret ny ${type} betalingsløsning`}
      actions={
        <>
          <Button onClick={onSave} variant="contained">Opret</Button>
          <Button onClick={onClose} variant="contained">Luk</Button>
        </>
      }
    >
      {type && <Typography>Her kan du oprette en ny betalingsløsning.</Typography>}
    </Dialog>
  )
}

export default function GeneralAppPage() {
  
  const router = useRouter()
  const { user } = useAuthContext()

  const solutions = useQuery(GET_SOLUTIONS, { variables: { merchantId: parseInt(router.hashParams.get('merchant'), 10) } })
console.log('solutions', solutions)
  const Popover = usePopover()

  const theme = useTheme()

  const { themeStretch } = useSettingsContext()

  const [ deleteSolution, ConfirmDeleteSolutionDialog ] = useConfirmDialog({
    onConfirm: () => null,
  })
  
  const createNewSolution = (type) => {
    router.updateHashParams({
      new_solution: type,
    })
  }

  
  return (
    <>

      <NewSolutionFormDialog type={router.hashParams.get('new_solution')} onClose={() => router.updateHashParams({ new_solution: null })} onSave={() => router.updateHashParams({ new_solution: null })} />
      <ConfirmDeleteSolutionDialog
        title="Slet betalingsløsning?"
        confirmLabel="Slet"
        confirmColor="error"
      >
        <Typography variant="inherit" gutterBottom>Er du sikker på at du vil slette din betalingsløsning?</Typography>
        <Typography variant="inherit">Denne handling kan ikke fortrydes!</Typography>
      </ConfirmDeleteSolutionDialog>

      <Head>
        <title>PayPilot | Løsninger</title>
      </Head>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>

        <Grid item container xs={12}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4">
              Løsninger
            </Typography>
            <Typography variant="body2" paragraph sx={(theme) => ({ color: theme.palette.grey[800], opacity: 0.64, mt: 1 })} gutterBottom>
              Se dine nuværende løsninger eller opret nye
            </Typography>
          </Grid>
          <Grid item container xs={12} md={8} display="flex" justifyContent="flex-end" alignItems="center" spacing={1}>
            <Popover.Component control={<CustomButton icon={<Iconify icon="fluent:chevron-down-20-filled" />}>Opret ny løsning</CustomButton>}>
              <MenuItem onClick={() => createNewSolution('POS')}>POS</MenuItem>
              <MenuItem onClick={() => createNewSolution('ECOM')}>ECOM</MenuItem>
              <MenuItem onClick={() => createNewSolution('MOTO')}>MOTO</MenuItem>
              <MenuItem onClick={() => createNewSolution('CAT')}>CAT</MenuItem>
            </Popover.Component>
          </Grid>
        </Grid>

        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 1.75 }}>
          {!solutions.data ? <CenteredLoadingIndicator /> : (solutions.data.map((solution, index) => {
            solution.completionPercent = 100
            return (
              <Grid item xs={12} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={(e) => {
                    if ((e?.target?.className?.indexOf('MuiModal') ?? -1) !== -1) return true
                    router.push(PATH_APP.solutions.view(solution.id))
                  }}>
                    <CardHeader
                      avatar={
                        <AvatarGroup max={4}>
                          {solution?.acquiring_services?.map((acquiring_service) => (
                            <Avatar
                              alt={(acquiring_service?.provider ?? acquiring_service?.partner)?.name}
                              src={img((acquiring_service?.provider ?? acquiring_service?.partner)?.logo?.url)}
                              sx={{
                                backgroundColor: 'background.paper',
                                '& .MuiAvatar-img': {
                                  objectFit: 'contain',
                                },
                              }}
                            />
                          ))}
                          <Avatar
                            alt={(solution?.gateway_service?.provider ?? solution?.gateway_service?.partner)?.name}
                            src={img((solution?.gateway_service?.provider ?? solution?.gateway_service?.partner)?.logo?.url)}
                            sx={{
                              backgroundColor: 'background.paper',
                              '& .MuiAvatar-img': {
                                objectFit: 'contain',
                              },
                            }}
                          />
                          <Avatar
                            alt={(solution?.terminal_service?.provider ?? solution?.terminal_service?.partner)?.name}
                            src={img((solution?.terminal_service?.provider ?? solution?.terminal_service?.partner)?.logo?.url)}
                            sx={{
                              backgroundColor: 'background.paper',
                              '& .MuiAvatar-img': {
                                objectFit: 'contain',
                              },
                            }}
                          />
                        </AvatarGroup>
                      }
                      action={
                        <MoreActionsButton
                          actions={[
                            { label: 'Slet', onClick: deleteSolution },
                          ]}
                        />
                      }
                    />
                    <CardContent>
                      <Typography variant="h6" color="text.primary">
                        {solution.name}
                      </Typography>
                      <LinearProgress
                        value={solution.completionPercent}
                        variant="determinate"
                        color={solution.completionPercent < 100 ? (solution.completionPercent >= 50 && solution.completionPercent < 100 ? 'warning' : 'error') : 'success'}
                        sx={{
                          my: 2,
                          height: 6,
                          '&::before': {
                            bgcolor: 'background.neutral',
                            opacity: 1,
                          },
                        }}
                      />

                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Box component="span" sx={{ typography: 'body2', color: 'text.disabled' }}>{fPercent(solution.completionPercent)}</Box>
                        <Box component="span" sx={{ typography: 'subtitle2' }}>/ 100%</Box>
                      </Stack>

                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            )
          }))}
        </Grid>
      </Container>
    </>
  );
}
