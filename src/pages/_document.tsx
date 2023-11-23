import * as React from 'react';
// next
import Document, { Html, Head, Main, NextScript } from 'next/document';
// @emotion
import createEmotionServer from '@emotion/server/create-instance';
// utils
import createEmotionCache from '../utils/createEmotionCache';
// theme
import palette from '../theme/palette';
import { primaryFont } from '../theme/typography';

// ----------------------------------------------------------------------

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className={primaryFont.className}>
        <Head>
          <meta charSet="utf-8" />
          <link rel="manifest" href="/manifest.json" />

          {/* PWA primary color */}
          <meta name="theme-color" content={palette('light').primary.main} />

          {/* Favicon */}
          <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
          <meta name="msapplication-TileColor" content="#603cba" />
          <meta name="msapplication-config" content="/browserconfig.xml" />

          {/* Emotion */}
          <meta name="emotion-insertion-point" content="" />
          {(this.props as any).emotionStyleTags}

          {/* Meta */}
          <meta
            name="description"
            content="PayPilot by Advisoa - payments, automated"
          />
          <meta name="keywords" content="paypilot,advisoa,payments,automated,free,money,business,payment,solution,transparency,consulting,advice,save,money,bigger,profits,increase,insights,kpis,automated,bookkeeping,gateway,acquiring,terminal,provider" />
          <meta name="author" content="Advisoa" />
              
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// ----------------------------------------------------------------------

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;

  const cache = createEmotionCache();

  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);

  const emotionStyles = extractCriticalToChunks(initialProps.html);

  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
