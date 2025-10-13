// sitemap.js
const fs = require('fs');
const { globby } = require('globby');

async function generateSitemap() {
  const pages = await globby([
    'src/pages/**/*.tsx',
    '!src/pages/_*.tsx', // Bỏ qua các file đặc biệt của Next.js
    '!src/pages/api',   // Bỏ qua các file API
    '!src/pages/admin'  // Bỏ qua trang admin
  ]);

  const urlset = pages
    .map((page) => {
      const path = page
        .replace('src/pages', '')
        .replace('.tsx', '')
        .replace('/index', '');
      const route = path === '' ? '/' : path;
      // Thay 'https://yourdomain.com' bằng tên miền thực tế của bạn
      return `<url><loc>${`https://yourdomain.com${route}`}</loc></url>`;
    })
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}</urlset>`;

  fs.writeFileSync('public/sitemap.xml', sitemap);
}

generateSitemap();