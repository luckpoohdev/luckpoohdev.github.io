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

import { EcommerceSalesOverview, EcommerceYearlySales, EcommerceCardDistribution, EcommerceWidgetSummary, EcommerceSaleByGender } from 'src/sections/@dashboard/general/e-commerce';
import { BankingExpensesCategories } from 'src/sections/@dashboard/general/banking';
import { BookingBookedRoom } from 'src/sections/@dashboard/general/booking';
import RevenueWidget from 'src/components/widgets/RevenueWidget';
import AveragePurchaseWidget from 'src/components/widgets/AveragePurchaseWidget';
import CompletedSalesWidget from 'src/components/widgets/CompletedSalesWidget';
import ReturnedSalesWidget from 'src/components/widgets/ReturnedSalesWidget';
import FailedSalesWidget from 'src/components/widgets/FailedSalesWidget';
import RepeatCustomerNumbersWidget from 'src/components/widgets/RepeatCustomerNumbersWidget';
import ReturnRateWidget from 'src/components/widgets/ReturnRateWidget';
import ErrorRateWidget from 'src/components/widgets/ErrorRateWidget';
import RepeatCustomerNumbersPercentageWidget from 'src/components/widgets/RepeatCustomerNumbersPercentageWidget';
import AbandonedSales from '@/components/widgets/AbandonedSalesWidget';
import useRouter from 'src/hooks/useRouter';
import PartiallyReturnedSalesWidget from '@/components/widgets/PartiallyReturnedSalesWidget';
import ThreeDsErrorsWidget from '@/components/widgets/ThreeDsErrorsWidget';
import AcquiringErrorsWidget from '@/components/widgets/AcquiringErrorsWidget';
import ThreeDsErrorRateWidget from '@/components/widgets/ThreeDsErrorRateWidget';
import DropOffRateWidget from '@/components/widgets/DropOffRateWidget';
import AcquiringErrorRateWidget from '@/components/widgets/AcquiringErrorRateWidget';
// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

import { useWidth } from 'src/hooks/useResponsive';
import useDashboardFilterSettings from 'src/hooks/useDashboardFilterSettings';

import DashboardTopBar from 'src/components/dashboard-top-bar';

export default function GeneralAppPage() {
  
  const { stores, datePeriod, selectedStoreId, selectedDatePeriod } = useDashboardFilterSettings();
  
  const router = useRouter();
  const merchantId = parseInt(router.hashParams.get('merchant'), 10);
  
  const breakpoints = useWidth()
  const mobile = ['xs', 's', 'sm'].indexOf(breakpoints) !== -1

  const theme = useTheme();

  return (
    <>
      <Head>
        <title>PayPilot | Dashboard > KPI'er</title>
      </Head>

      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>
        <DashboardTopBar subTitle="Her er dit overblik over KPI'er" />
        <Grid container rowSpacing={3.5} columnSpacing={{ xs: 3.5, md: 5 }} sx={{ pt: 0.5 }}>

          <Grid item xs={12} md={4}>
            <RevenueWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AveragePurchaseWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>

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
           <ReturnedSalesWidget
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
            <ThreeDsErrorsWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AcquiringErrorsWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <ReturnRateWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <ErrorRateWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RepeatCustomerNumbersWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>

        
          <Grid item xs={12} md={4}>
            <ThreeDsErrorRateWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DropOffRateWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AcquiringErrorRateWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
