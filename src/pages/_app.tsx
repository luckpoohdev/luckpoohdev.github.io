// react
import { useRef, useEffect } from 'react'

// i18n
import '../locales/i18n';

// flags
import 'flag-icons/css/flag-icons.min.css';

// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// lightbox
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------
// apollo
import { ApolloProvider } from '@apollo/client'
// emotion
import { CacheProvider, EmotionCache } from '@emotion/react';
// next
import { NextPage } from 'next';
import Head from 'next/head';
import { AppProps } from 'next/app';
// redux
import { Provider as ReduxProvider } from 'react-redux';
// @mui
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// redux
import { store } from '../redux/store';
// utils
import createEmotionCache from '../utils/createEmotionCache';
// theme
import ThemeProvider from '../theme';
// locales
import ThemeLocalization from '../locales';
// components
import { StyledChart } from '../components/chart';
import ProgressBar from '../components/progress-bar';
import SnackbarProvider from '../components/snackbar';
import { MotionLazyContainer } from '../components/animate';
import { ThemeSettings, SettingsProvider } from '../components/settings';

import { TawkProvider } from 'src/hooks/useTawk';
import { MarkerWidgetProvider } from 'src/hooks/useMarkerWidget';

import client from 'src/apollo-client'
import { MainLoadingIndicatorProvider } from 'src/hooks/useMainLoadingIndicator'
import useSession, { SessionProvider } from 'src/hooks/useSession'

// Check our docs
// https://docs.minimals.cc/authentication/ts-version

// import { AuthProvider } from '../auth/Auth0Context';
// import { AuthProvider } from '../auth/FirebaseContext';
// import { AuthProvider } from '../auth/AwsCognitoContext';

// ----------------------------------------------------------------------

import dayjs from 'dayjs'
import dayjsGreetPlugin from 'src/utils/dayjsGreetPlugin';
dayjs.extend(dayjsGreetPlugin)

import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey('b57d7377b58d3e7a891bb7b4ba783c13Tz01OTU0OCxFPTE3MDc1OTEwNjM4ODgsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');

const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}


export default function MyApp(props: MyAppProps) {

  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <SessionProvider>
        <MainLoadingIndicatorProvider>
          <ReduxProvider store={store}>
            <ApolloProvider client={client}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <SettingsProvider>
                  <MotionLazyContainer>
                    <ThemeProvider>
                      <ThemeSettings>
                        <ThemeLocalization>
                          <SnackbarProvider>
                            <StyledChart />
                            <ProgressBar />
                            <MarkerWidgetProvider>
                              <TawkProvider>
                                {getLayout(<Component {...pageProps} />)}
                              </TawkProvider>
                            </MarkerWidgetProvider>
                          </SnackbarProvider>
                        </ThemeLocalization>
                      </ThemeSettings>
                    </ThemeProvider>
                  </MotionLazyContainer>
                </SettingsProvider>
              </LocalizationProvider>
            </ApolloProvider>
          </ReduxProvider>
        </MainLoadingIndicatorProvider>
      </SessionProvider>
    </CacheProvider>
  );
}
