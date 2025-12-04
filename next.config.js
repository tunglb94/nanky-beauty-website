/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bật chế độ xuất tĩnh (Static Export)
  output: 'export', 
  
  // Vô hiệu hóa tính năng image optimization mặc định (không tương thích với export)
  images: {
    unoptimized: true,
  },
  
  // (Các cấu hình khác nếu có)
};

module.exports = nextConfig;