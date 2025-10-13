# === STAGE 1: BUILD ===
# Stage này chỉ chạy trên PC của bạn, nhưng chúng ta vẫn giữ nó ở đây để tham khảo
# FROM node:18-bookworm-slim AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# === STAGE 2: PRODUCTION ===
# Đây là stage duy nhất NAS của bạn thực sự cần
FROM node:18-bookworm-slim

# Đặt môi trường là production
ENV NODE_ENV production

WORKDIR /app

# Tạo trước một người dùng không có quyền root tên là 'nextjs'
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

# Sao chép các thư mục cần thiết từ bản build của bạn
# Bản build standalone đã bao gồm node_modules
COPY ./.next/standalone ./
COPY ./.next/static ./.next/static
COPY ./public ./public
COPY ./locales ./locales

# Cấp quyền sở hữu toàn bộ thư mục cho người dùng 'nextjs'
RUN chown -R nextjs:nextjs /app

# Chuyển sang người dùng không có quyền root
USER nextjs

EXPOSE 3000

# Lệnh khởi động server
CMD ["node", "server.js"]