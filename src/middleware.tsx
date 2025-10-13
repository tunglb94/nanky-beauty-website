import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Dùng jose cho Edge environment

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;
    const { pathname } = req.nextUrl;
    
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        console.error("JWT_SECRET chưa được thiết lập.");
        // Chuyển hướng đến trang lỗi hoặc trang đăng nhập
        const loginUrl = new URL('/admin/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // Nếu người dùng cố gắng truy cập trang admin mà không có token
    if (!token && pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const loginUrl = new URL('/admin/login', req.url);
        loginUrl.searchParams.set('from', pathname); // Lưu lại trang muốn vào
        return NextResponse.redirect(loginUrl);
    }
    
    // Nếu có token, xác thực nó
    if (token) {
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            await jwtVerify(token, secret);

            // Nếu token hợp lệ và người dùng đang ở trang login, chuyển hướng vào admin
            if (pathname.startsWith('/admin/login')) {
                return NextResponse.redirect(new URL('/admin', req.url));
            }
            // Nếu token hợp lệ, cho phép truy cập
            return NextResponse.next();
        } catch (error) {
            // Nếu token không hợp lệ (hết hạn, sai chữ ký)
            const loginUrl = new URL('/admin/login', req.url);
            // Xóa cookie cũ
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('auth-token');
            return response;
        }
    }
    
    return NextResponse.next();
}

// Config để middleware chỉ chạy trên các route admin
export const config = {
    matcher: ['/admin/:path*'],
};