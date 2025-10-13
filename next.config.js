/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bật tính năng Styled Components
  compiler: {
    styledComponents: true,
  },
  // Bật tính năng SASS (SCSS)
  sassOptions: {
    // Để Next.js biết tìm file SCSS ở đâu
    includePaths: [require('path').join(__dirname, 'src/assets/styles')],
  },
  // Cấu hình Header để hỗ trợ đa ngôn ngữ/tối ưu SEO nếu cần
  i18n: {
    locales: ['vi', 'en', 'ru', 'kr'],
    defaultLocale: 'vi',
    // detection: false, // Tùy chọn: Tắt tự động phát hiện ngôn ngữ để dùng LanguageSwitcher custom
  }
};

module.exports = nextConfig;