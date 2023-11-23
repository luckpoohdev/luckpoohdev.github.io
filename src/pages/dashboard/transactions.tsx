// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
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
// sections
import {
  AppTopRelated,
  AppWidgetSummary,
} from '../../sections/@dashboard/general/app';
// assets

import useRouter from 'src/hooks/useRouter';
import { EcommerceSalesOverview, EcommerceYearlySales, EcommerceCardDistribution, EcommerceWidgetSummary, EcommerceSaleByGender } from 'src/sections/@dashboard/general/e-commerce';
import { BankingExpensesCategories } from 'src/sections/@dashboard/general/banking';
import { BookingBookedRoom } from 'src/sections/@dashboard/general/booking';
import LatestTransactionsTable from 'src/components/transactions/latest';

// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

import { useWidth } from 'src/hooks/useResponsive';
import useDashboardFilterSettings from 'src/hooks/useDashboardFilterSettings';
import Return from '@/components/widgets/ReturnedTransactionsWidget';
import DashboardTopBar from 'src/components/dashboard-top-bar';
import ThreeDsErrorsWidget from '@/components/widgets/ThreeDsErrorsWidget';
import PaidTransactionsWidget from 'src/components/widgets/PaidTransactionsWidget';
import SettledTransactionsWidget from 'src/components/widgets/SettledTransactionsWidget';
import AuthorizedTransactionsWidget from 'src/components/widgets/AuthorizedTransactionsWidget';
import RefundedTransactionsWidget from 'src/components/widgets/RefundedTransactionsWidget';
import AbandonedCheckoutsWidget from '@/components/widgets/AbandonedCheckoutsWidget';
import FailedTransactionsWidget from 'src/components/widgets/FailedTransactionsWidget';
import TransactionsNumbersWidget from 'src/components/widgets/TransactionsNumbersWidget';
import FailedTransactionsDistributionWidget from 'src/components/widgets/FailedTransactionsDistributionWidget';
import AcquiringErrorsWidget from '@/components/widgets/AcquiringErrorsWidget';
import ReturnedTransactionsWidget from '@/components/widgets/ReturnedTransactionsWidget';
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
        <title>PayPilot | Dashboard > Transaktioner</title>
      </Head>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>
        <DashboardTopBar subTitle="Her er dit transaktionsoverblik" />
        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0.5 }}>

          <Grid item xs={12} md={4}>
            <PaidTransactionsWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <SettledTransactionsWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AuthorizedTransactionsWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <RefundedTransactionsWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ReturnedTransactionsWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
       

          <Grid item xs={12} md={4}>
            <AbandonedCheckoutsWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FailedTransactionsWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>


          <Grid item xs={12} md={4} >
            <ThreeDsErrorsWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          
          <Grid item xs={12} md={4} >
            <AcquiringErrorsWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>




          <Grid item xs={12} md={8} >
            <TransactionsNumbersWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>

          <Grid item xs={12} md={4} >
            <FailedTransactionsDistributionWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
       
          <Grid item xs={12}>
            <LatestTransactionsTable storeId={selectedStoreId} startDate={datePeriod[0]} endDate={datePeriod[1]} rowActions={[
              { label: 'Vis transaktion', onClick: (params) => {
                router.push(PATH_APP.payments.transactions.view(params.id))
              } },
            ]} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
