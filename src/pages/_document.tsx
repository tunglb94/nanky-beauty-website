import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    // const FACEBOOK_PIXEL_ID = 'YOUR_PIXEL_ID'; // Giữ lại nếu bạn còn dùng FB Pixel

    return (
      // === THÊM lang="vi" ===
      <Html lang="vi">
        <Head>
          {/* === XÓA Gtag scripts ở đây === */}
          {/* === XÓA TikTok Pixel script ở đây === */}
          {/* === XÓA Facebook Pixel scripts ở đây (nếu có và chuyển sang _app.tsx) === */}


          {/* ==================================================== */}
          {/* START: FAVICON */}
          {/* ==================================================== */}
          <link
            rel="icon"
            href="/images/favicon.ico"
            sizes="any"
          />
          <link
            rel="shortcut icon"
            href="/images/favicon.ico"
            sizes="any"
          />
          {/* ==================================================== */}
          {/* END: FAVICON */}
          {/* ==================================================== */}

          {/* === Các link fonts và preconnect/preload giữ nguyên === */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
              rel="preload"
              as="style"
              href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;1,400&family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;500;600&display=swap"
          />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;1,400&family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}