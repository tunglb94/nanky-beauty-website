/** @type {import('next').NextConfig} */
const nextConfig = {
  // Thêm dòng này để tạo bản build độc lập, tối ưu cho Docker
  output: 'standalone',

  // Các cấu hình khác của bạn (nếu có)
  reactStrictMode: true,
  
  // Cấu hình để Next.js tương thích với styled-components
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;