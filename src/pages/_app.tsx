import React from 'react';
import type { AppProps } from 'next/app';
// Bỏ import Head from 'next/head';
import { I18nProvider } from '../hooks/useI18n'; 
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import '../assets/styles/global.scss'; 

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
  return (
    <I18nProvider>
      <ThemeProvider theme={theme}>
        {/* Xóa bỏ hoàn toàn component <Head> và các link fonts ở đây */}
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </I18nProvider>
  );
}

export default MyApp;