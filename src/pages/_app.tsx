import React from 'react';
import type { AppProps } from 'next/app';
import { I18nProvider } from '../hooks/useI18n';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import '../assets/styles/global.scss';
import FixedContactWidget from '../components/ui/FixedContactWidget';
import Script from 'next/script'; // === IMPORT Script ===

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
    color: #333;
    background-color: #fff;
    overflow-x: hidden;
  }

  h1, h2, h3, h4 {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
  }
`;

const theme = {
  colors: {
    primary: '#C6A500',
    secondary: '#1a1a1a',
    white: '#FFFFFF',
    darkText: '#222222',
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  const GTAG_ID = 'G-MDDCJG6VMK'; // Thay bằng ID của bạn nếu khác
  // === THAY ĐỔI PIXEL ID TẠI ĐÂY ===
  const TIKTOK_PIXEL_ID = 'D43NOUBC77UC9DOCMRD0'; // ID mới bạn vừa cung cấp

  return (
    <I18nProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />

        {/* === GOOGLE TAG MANAGER (Gtag.js) === */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GTAG_ID}');
            `,
          }}
        />

        {/* === TIKTOK PIXEL (Đã cập nhật ID) === */}
        <Script
          id="tiktok-pixel-init"
          strategy="lazyOnload" // Tải khi trình duyệt rảnh
          dangerouslySetInnerHTML={{
            __html: `
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
            var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var i=document.createElement("script");i.type="text/javascript",i.async=!0,i.src=r+"?sdkid="+e+"&lib="+t;var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(i,s)};
              ttq.load('${TIKTOK_PIXEL_ID}');
              ttq.page();
            }(window, document, 'ttq');
            `,
           }}
        />
        {/* === KẾT THÚC SCRIPTS === */}


        <Component {...pageProps} />
        <FixedContactWidget />
      </ThemeProvider>
    </I18nProvider>
  );
}

export default MyApp;