// react
import { useMemo } from 'react';
// next
import Head from 'next/head';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import { Container, Grid, Box, Typography, Button } from '@mui/material';
// dayjs
import dayjs from 'dayjs';
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
// sections
import {
  AppTopRelated,
  AppWidgetSummary,
} from '../../sections/@dashboard/general/app';
// assets

import { EcommerceSalesOverview, EcommerceYearlySales, EcommerceCardDistribution, EcommerceWidgetSummary, EcommerceCostsOfPayment } from 'src/sections/@dashboard/general/e-commerce';
import { BankingExpensesCategories } from 'src/sections/@dashboard/general/banking';
import { BookingBookedRoom } from 'src/sections/@dashboard/general/booking';
import { useAuthContext } from 'src/auth/useAuthContext';
import { GET_TRANSACTIONS, GET_CUSTOMERS, GET_INTEGRATIONS } from 'src/queries/dashboard';

import PaymentCostsOverviewWidget from 'src/components/widgets/PaymentCostsOverviewWidget';
import DetailedRevenueWidget from 'src/components/widgets/DetailedRevenueWidget';
import AveragePurchaseWidget from 'src/components/widgets/AveragePurchaseWidget';
import CustomerDistributionWidget from 'src/components/widgets/CustomerDistributionWidget';
import PaymentMethodDistributionWidget from 'src/components/widgets/PaymentMethodDistributionWidget';
import SalesDistributionWidget from 'src/components/widgets/SalesDistributionWidget';
import RegionalSalesDistributionWidget from 'src/components/widgets/RegionalSalesDistributionWidget';
import IntegrationsListWidget from 'src/components/widgets/IntegrationsListWidget';
import { useQuery } from 'src/hooks/apollo';
import useRouter from 'src/hooks/useRouter';
import { fCurrency } from 'src/utils/formatNumber';
import img from 'src/utils/img';

// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

import { useWidth } from 'src/hooks/useResponsive';
import useDashboardFilterSettings from 'src/hooks/useDashboardFilterSettings';

import DashboardTopBar from 'src/components/dashboard-top-bar';

import countryLocaleDA from 'i18n-iso-countries/langs/da.json'
countries.registerLocale(countryLocaleDA);

const paymentMethodLabels = {
  'card': 'Kortbetaling',
  'mobilepay': 'MobilePay Online',
};
const getPaymentMethodLabel = (payment_method) => paymentMethodLabels[payment_method] ?? payment_method;

export default function GeneralAppPage() {
  
  const { stores, datePeriod, selectedStoreId, selectedDatePeriod } = useDashboardFilterSettings();
  
  const router = useRouter();
  const merchantId = parseInt(router.hashParams.get('merchant'), 10);
  
  const breakpoints = useWidth()
  const mobile = ['xs', 's', 'sm'].indexOf(breakpoints) !== -1

  const theme = useTheme();
  const auth = useAuthContext();

  return (
    <>
      <Head>
        <title>PayPilot | Dashboard > Overblik</title>
      </Head>
      
      <Container maxWidth={/*themeStretch ? false : 'xl'*/false} sx={{ pt: 1.5 }}>
        <DashboardTopBar subTitle="Her er dit generelle overblik og performance" />
        <Grid container spacing={3.5} sx={{ pt: 0.5 }}>

          <Grid item container xs={12} spacing={mobile ? 3.5 : 5}>

            <Grid item xs={12} md={4}>
              <PaymentCostsOverviewWidget
                merchantId={merchantId}
                storeId={selectedStoreId}
                startPeriod={datePeriod[0]}
                endPeriod={datePeriod[1]}
                selectedPeriod={selectedDatePeriod}
              />
            </Grid>

            <Grid item xs={12} md={4} sx={{ position: 'relative', boxSizing: 'border-box' }}>
              {/*<Button sx={{ textTransform: 'none', textAlign: 'left', position: 'absolute', backdropFilter: 'blur(6px)', width: 'calc(100% - 39px)', height: 'calc(100% - 39px)', p: 3, pt: 2, zIndex: 2, boxSizing: 'border-box', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>Øg din konvertering</Typography>
                <Typography sx={(theme) => ({ color: 'white', backgroundColor: alpha(theme.palette.primary.main, 0.75), py: 1, px: 2, borderRadius: 1 })}>
                  Mister du kunder, fordi de ikke kan betale?<br />Klik her, for at få den rette betalingsløsning til DIN virksomhed, og gå aldrig ned på potentielle kunder igen - det er fuldstændigt gratis.
                </Typography>
              </Button>*/}
              {/*<EcommerceWidgetSummary
                title="Øget konvertering"
                percent={60}
                inverse
                total={25}
                chart={{
                  colors: [theme.palette.primary.main],
                  series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
                }}
              />*/}
              <EcommerceWidgetSummary
                title="Besparelse optjent"
                percent={16}
                total={9650}
                currency
                chart={{
                  colors: [theme.palette.primary.main],
                  series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
                }}
              />
            </Grid>

            {/*<Grid item xs={12} md={4} sx={{ position: 'relative', boxSizing: 'border-box' }}>
              <Button sx={{ textTransform: 'none', textAlign: 'left', position: 'absolute', backdropFilter: 'blur(6px)', width: 'calc(100% - 39px)', height: 'calc(100% - 39px)', p: 3, pt: 2, zIndex: 2, boxSizing: 'border-box', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>Få gratis penge</Typography>
                <Typography sx={(theme) => ({ color: 'white', backgroundColor: alpha(theme.palette.primary.main, 0.75), py: 1, px: 2, borderRadius: 1 })}>
                  Uden at røve en bank. Faktisk er 35-40% af dine betalingsgebyrer unødvendige. Dem forhandler vi i bund, gratis - og det kalder vi gratis penge. Klik her for at komme i udbud :)
                </Typography>
              </Button>
            </Grid>*/}

            <Grid item xs={4}>
              <AveragePurchaseWidget
                merchantId={merchantId}
                storeId={selectedStoreId}
                startPeriod={datePeriod[0]}
                endPeriod={datePeriod[1]}
                selectedPeriod={selectedDatePeriod}
              />
            </Grid>

            <Grid item xs={8}>
              <DetailedRevenueWidget
                merchantId={merchantId}
                storeId={selectedStoreId}
                startPeriod={datePeriod[0]}
                endPeriod={datePeriod[1]}
                selectedPeriod={selectedDatePeriod}
              />
            </Grid>

            <Grid item xs={4}>
                <CustomerDistributionWidget
                  merchantId={merchantId}
                  storeId={selectedStoreId}
                  startPeriod={datePeriod[0]}
                  endPeriod={datePeriod[1]}
                  selectedPeriod={selectedDatePeriod}
                />
              </Grid>

            <Grid item xs={12}>
              <PaymentMethodDistributionWidget
                merchantId={merchantId}
                storeId={selectedStoreId}
                startPeriod={datePeriod[0]}
                endPeriod={datePeriod[1]}
                selectedPeriod={selectedDatePeriod}
              />
            </Grid>

            <Grid item xs={8}>
              <RegionalSalesDistributionWidget
                merchantId={merchantId}
                storeId={selectedStoreId}
                startPeriod={datePeriod[0]}
                endPeriod={datePeriod[1]}
                selectedPeriod={selectedDatePeriod}
              />
            </Grid>

            <Grid item xs={4}>
                <SalesDistributionWidget
                  merchantId={merchantId}
                  storeId={selectedStoreId}
                  startPeriod={datePeriod[0]}
                  endPeriod={datePeriod[1]}
                  selectedPeriod={selectedDatePeriod}
                />
              </Grid>

          </Grid>

          <Grid item container xs={12} md={4} alignContent="flex-start" spacing={mobile ? 3.5 : 5}>



          </Grid>

        </Grid>
      </Container>
    </>
  );
}
