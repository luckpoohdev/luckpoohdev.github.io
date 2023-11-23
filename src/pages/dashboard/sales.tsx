// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
// countries
import countries from 'i18n-iso-countries';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// _mock_
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from '../../_mock/arrays';
// assets
import LatestSalesTable from 'src/components/sales/latest';
import useRouter from 'src/hooks/useRouter';

// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

import countryLocaleDA from 'i18n-iso-countries/langs/da.json'
countries.registerLocale(countryLocaleDA);

import { useWidth } from 'src/hooks/useResponsive';
import useDashboardFilterSettings from 'src/hooks/useDashboardFilterSettings';
import ProcessingSales from '@/components/widgets/ProcessingSales';
import DashboardTopBar from 'src/components/dashboard-top-bar';
import CompletedSalesWidget from 'src/components/widgets/CompletedSalesWidget';
import FailedSalesWidget from 'src/components/widgets/FailedSalesWidget';
import ReturnedSalesWidget from 'src/components/widgets/ReturnedSalesWidget';
import CompletedSalesDistributionWidget from 'src/components/widgets/CompletedSalesDistributionWidget';
import SalesNumbersWidget from 'src/components/widgets/SalesNumbersWidget';
import AbandonedSales from '@/components/widgets/AbandonedSalesWidget';
import PartiallyReturnedSalesWidget from '@/components/widgets/PartiallyReturnedSalesWidget';
export default function GeneralAppPage() {
  
  const { stores, datePeriod, selectedStoreId, selectedDatePeriod } = useDashboardFilterSettings()

  const router = useRouter();
  const merchantId = parseInt(router.hashParams.get('merchant'), 10);
  
  const breakpoints = useWidth()
  const mobile = ['xs', 's', 'sm'].indexOf(breakpoints) !== -1

  const theme = useTheme();
  
  return (
    <>
      <Head>
        <title>PayPilot | Dashboard > Salg</title>
      </Head>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>
        <DashboardTopBar subTitle="Her er dit salgsoverblik" />
        <Grid container spacing={3.5} sx={{ pt: 0.5 }}>

          <Grid item container xs={12} spacing={mobile ? 3.5 : 5}>

            <Grid item xs={12} md={4}>
              <CompletedSalesWidget
                merchantId={merchantId}
                storeId={selectedStoreId}
                startPeriod={datePeriod[0]}
                endPeriod={datePeriod[1]}
                selectedPeriod={selectedDatePeriod}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ProcessingSales
                merchantId={merchantId}
                storeId={selectedStoreId}
                startPeriod={datePeriod[0]}
                endPeriod={datePeriod[1]}
                selectedPeriod={selectedDatePeriod}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <AbandonedSales
                merchantId={merchantId}
                storeId={selectedStoreId}
                startPeriod={datePeriod[0]}
                endPeriod={datePeriod[1]}
                selectedPeriod={selectedDatePeriod}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <PartiallyReturnedSalesWidget
                merchantId={merchantId}
                storeId={selectedStoreId}
                startPeriod={datePeriod[0]}
                endPeriod={datePeriod[1]}
                selectedPeriod={selectedDatePeriod}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FailedSalesWidget
                merchantId={merchantId}
                storeId={selectedStoreId}
                startPeriod={datePeriod[0]}
                endPeriod={datePeriod[1]}
                selectedPeriod={selectedDatePeriod}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <ReturnedSalesWidget
                merchantId={merchantId}
                storeId={selectedStoreId}
                startPeriod={datePeriod[0]}
                endPeriod={datePeriod[1]}
                selectedPeriod={selectedDatePeriod}
              />
            </Grid>

          </Grid>

          <Grid item container xs={12} spacing={mobile ? 3.5 : 5}>
            
            <Grid item container xs={12} md={8} spacing={3.5}>

              <Grid item xs={12}>
                <SalesNumbersWidget
                  merchantId={merchantId}
                  storeId={selectedStoreId}
                  startPeriod={datePeriod[0]}
                  endPeriod={datePeriod[1]}
                  selectedPeriod={selectedDatePeriod}
                />
              </Grid>

            </Grid>

            <Grid item container xs={12} md={4} spacing={3.5}>

              <Grid item xs={12}>
                <CompletedSalesDistributionWidget
                  merchantId={merchantId}
                  storeId={selectedStoreId}
                  startPeriod={datePeriod[0]}
                  endPeriod={datePeriod[1]}
                  selectedPeriod={selectedDatePeriod}
                />
              </Grid>

            </Grid>

          </Grid>
          <Grid item xs={12}>
            <LatestSalesTable storeId={selectedStoreId} startDate={datePeriod[0]} endDate={datePeriod[1]} rowActions={[
              { label: 'Vis transaktionshistorik', onClick: (params) => router.updateHashParams({
                transaction_history: params.id,
              }) },
              { label: 'Vis transaktioner', onClick: (params) => router.push(`${PATH_APP.payments.sales.view(params.id)}#tab=transactions`) },
              { label: 'Vis ordredetaljer', onClick: (params) => {
                router.push(PATH_APP.payments.sales.view(params.id))
              } },
            ]} />
          </Grid>

        </Grid>
      </Container>
    </>
  );
}
