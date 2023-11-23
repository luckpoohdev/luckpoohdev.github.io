// react
import * as React from 'react'
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
// components
import { EcommerceSalesOverview, EcommerceWidgetSummary } from 'src/sections/@dashboard/general/e-commerce';
import { BankingExpensesCategories } from 'src/sections/@dashboard/general/banking';
import ElementLimiter from 'src/components/element-limiter';
import useRouter from 'src/hooks/useRouter';

// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

import { useWidth } from 'src/hooks/useResponsive';
import useDashboardFilterSettings from 'src/hooks/useDashboardFilterSettings';

import DashboardTopBar from 'src/components/dashboard-top-bar';

import CostWidget from 'src/components/cost-widget';
import LatestSalesTable from 'src/components/sales/latest'

import PaymentCostsOverviewWidget from 'src/components/widgets/PaymentCostsOverviewWidget';
import AcquiringCostsOverviewWidget from 'src/components/widgets/AcquiringCostsOverviewWidget';
import GatewayCostsOverviewWidget from 'src/components/widgets/GatewayCostsOverviewWidget';
import CardCostsOverviewWidget from 'src/components/widgets/CardCostsOverviewWidget';
import ThirdPartyCostsOverviewWidget from 'src/components/widgets/ThirdPartyCostsOverviewWidget';
import DetailedCostsShareOverviewWidget from 'src/components/widgets/DetailedCostsShareOverviewWidget';
import CardSplitCostsOverviewWidget from 'src/components/widgets/CardSplitCostsOverviewWidget';
import AuthorizationFeesWidget from '@/components/widgets/AuthorizationFeesWidget';
import ThreeDsFeesWidget from '@/components/widgets/ThreeDsFeesWidget';
import LateCaptureFeesWidget from '@/components/widgets/LateCaptureFeesWidget';
import SavedCardFeesWidget from '@/components/widgets/SavedCardFeesWidget';
import RefundFeesWidget from '@/components/widgets/RefundFeesWidget';
import CurrencyConversionFeesWidget from '@/components/widgets/CurrencyConversionFeesWidget';
import SettlementFeesWidget from '@/components/widgets/SettlementFeesWidget';
import DisputeFeesWidget from '@/components/widgets/DisputeFeesWidget';
import MiscellaneousFeesWidget from '@/components/widgets/MiscellaneousFeesWidget';
import CmsFeesWidget from '@/components/widgets/CmsFeesWidget';

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
        <title>PayPilot | Dashboard > Omkostninger</title>
      </Head>
      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>
        <DashboardTopBar subTitle="Her er et samlet overblik over dine omkostninger og fordelingen heraf" />
        <Grid container spacing={3.5} sx={{ pt: 0.5 }}>
          <Grid item xs={12} md={4}>
            <PaymentCostsOverviewWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AcquiringCostsOverviewWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <GatewayCostsOverviewWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <CardCostsOverviewWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          <ThirdPartyCostsOverviewWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          <Grid item xs={12} md={4}>
            <CmsFeesWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AuthorizationFeesWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ThreeDsFeesWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <LateCaptureFeesWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SavedCardFeesWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <RefundFeesWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CurrencyConversionFeesWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SettlementFeesWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
         
          <Grid item xs={12} md={4}>
            <DisputeFeesWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MiscellaneousFeesWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12}>
            <DetailedCostsShareOverviewWidget
              merchantId={merchantId}
              storeId={selectedStoreId}
              startPeriod={datePeriod[0]}
              endPeriod={datePeriod[1]}
              selectedPeriod={selectedDatePeriod}
            />
          </Grid>
          <Grid item xs={12}>
            <CardSplitCostsOverviewWidget
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
