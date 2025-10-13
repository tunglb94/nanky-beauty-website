import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import fs from 'fs';
import path from 'path';

// ===============================================
// CẤU HÌNH RATE LIMITER
// ===============================================

const maxWrongAttemptsByIP = 10; // Tối đa 10 lần nhập sai
const blockDuration = 60 * 15;   // Khóa trong 15 phút (tính bằng giây)

const limiter = new RateLimiterMemory({
  points: maxWrongAttemptsByIP,
  duration: blockDuration, 
});

// Hàm helper để đọc .env.local
const getEnvVariableFromFile = (variableName: string): string | null => {
    try {
        const envFilePath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envFilePath)) return null;
        const fileContent = fs.readFileSync(envFilePath, { encoding: 'utf8' });
        const match = fileContent.match(new RegExp(`^${variableName}=(.*)`, "m"));
        return match ? match[1].trim().replace(/['"]/g, '') : null;
    } catch { return null; }
};

// ===============================================
// API HANDLER
// ===============================================

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Lấy địa chỉ IP của người dùng. Ưu tiên header từ proxy/load balancer.
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    try {
        // Kiểm tra xem IP có bị khóa hay không
        await limiter.consume(ip);
    } catch (limiterResponse) {
        // Nếu IP bị khóa, trả về lỗi
        const secs = Math.ceil(limiterResponse.msBeforeNext / 1000);
        res.setHeader('Retry-After', String(secs));
        return res.status(429).json({ 
            error: `Quá nhiều lần đăng nhập sai. Vui lòng thử lại sau ${Math.ceil(secs / 60)} phút.` 
        });
    }

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Vui lòng nhập đủ tên đăng nhập và mật khẩu.' });
        }

        const ADMIN_USERNAME = getEnvVariableFromFile('ADMIN_USERNAME');
        const ADMIN_PASSWORD_HASH = getEnvVariableFromFile('ADMIN_PASSWORD_HASH');
        const JWT_SECRET = getEnvVariableFromFile('JWT_SECRET');

        if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
            console.error("Lỗi nghiêm trọng: Biến môi trường chưa được thiết lập đầy đủ.");
            return res.status(500).json({ error: 'Lỗi cấu hình server.' });
        }

        const isUsernameCorrect = username === ADMIN_USERNAME;
        const isPasswordCorrect = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

        if (!isUsernameCorrect || !isPasswordCorrect) {
            // Nếu đăng nhập sai, ghi nhận một lần thử thất bại cho IP này
            try {
                await limiter.consume(ip);
            } catch (err) {
                // Lỗi này không cần xử lý, chỉ để ghi nhận
            }
            return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không hợp lệ.' });
        }

        // Nếu đăng nhập thành công, reset bộ đếm cho IP này
        await limiter.delete(ip);

        const token = jwt.sign(
            { username: ADMIN_USERNAME, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        const cookie = serialize('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 60 * 60 * 8,
            path: '/',
        });

        res.setHeader('Set-Cookie', cookie);
        res.status(200).json({ success: true, message: 'Đăng nhập thành công.' });

    } catch (error) {
        console.error("Lỗi khi xử lý đăng nhập:", error);
        return res.status(500).json({ error: 'Lỗi server khi xác thực.' });
    }
};

export default handler;