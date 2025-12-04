/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

const POSTS_DIRECTORY = path.join(process.cwd(), 'src', 'content', 'posts');
const SITE_URL = 'https://nankybeauty.com';
const SUPPORTED_LANGS = ['vi', 'en', 'ru', 'kr', 'zh'];

const getPostSlugs = () => {
  try {
    const fileNames = fs.readdirSync(POSTS_DIRECTORY);
    return fileNames
      .filter(fileName => fileName.endsWith('.json'))
      .map(fileName => fileName.replace(/\.json$/, ''));
  } catch (error) {
    console.error('Error reading post directory:', error);
    return [];
  }
};

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  outDir: './out',
  alternateRefs: SUPPORTED_LANGS.map(lang => ({
    href: `${SITE_URL}/${lang}`, // Điều chỉnh nếu cấu trúc URL khác (ví dụ: /en/ không cần /en)
    hreflang: lang,
  })),
  exclude: ['/404'], // Các trang không muốn đưa vào sitemap
  transform: async (config, path) => {
    const baseProps = {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs.map(ref => ({
          ...ref,
          // Điều chỉnh href cho alternateRefs của trang tĩnh
          href: ref.href.replace(/\/$/, '') + (path === '/' ? '' : path) // Ví dụ: /en + /about -> /en/about
      })) || [],
    };

    if (path === '/') {
      baseProps.priority = 1.0;
      // Chỉnh sửa alternateRefs cho trang chủ để không bị dư /
      baseProps.alternateRefs = SUPPORTED_LANGS.map(lang => ({
        href: `${SITE_URL}${lang === 'vi' ? '' : '/' + lang}`,
        hreflang: lang === 'vi' ? 'x-default' : lang,
      }));

    } else if (path === '/news') {
      baseProps.changefreq = 'weekly';
      baseProps.priority = 0.8;
    } else {
        // Gán x-default cho các trang khác nếu cần
        baseProps.alternateRefs = SUPPORTED_LANGS.map(lang => ({
            href: `${SITE_URL}/${lang === 'vi' ? '' : lang }${path}`,
            hreflang: lang === 'vi' ? 'x-default' : lang,
        }));
    }


    return baseProps;
  },
  additionalPaths: async (config) => {
    const slugs = getPostSlugs();
    const paths = [];

    slugs.forEach(slug => {
      const postPath = `/news/${slug}`;
      paths.push({
        loc: `${SITE_URL}${postPath}`, // URL chính (tiếng Việt)
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
         alternateRefs: SUPPORTED_LANGS.map(lang => ({
            href: `${SITE_URL}/${lang === 'vi' ? '' : lang}${postPath}`,
            hreflang: lang === 'vi' ? 'x-default' : lang, // Đặt 'vi' làm x-default
         }))
         // Không cần filter x-default ra vì đã gán trực tiếp
      });
    });

    return paths;
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      // Bạn có thể thêm các quy tắc Disallow khác ở đây nếu cần
      // Ví dụ: { userAgent: '*', disallow: '/admin/' },
    ],
    // Không cần thêm dòng "Content-signal" ở đây
    // additionalSitemaps: [
    //   `${SITE_URL}/sitemap.xml`, // Sitemap index đã bao gồm các sitemap con
    // ],
  },
};