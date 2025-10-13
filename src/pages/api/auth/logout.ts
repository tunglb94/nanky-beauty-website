import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Xóa cookie bằng cách set maxAge = -1
    const cookie = serialize('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: -1, // Hết hạn ngay lập tức
        path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ success: true, message: 'Đã đăng xuất.' });
}