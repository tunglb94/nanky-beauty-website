import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

// Helper function để đọc giá trị từ tệp .env.local
const getEnvVariableFromFile = (variableName: string): string | null => {
    try {
        const envFilePath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envFilePath)) return null;
        const fileContent = fs.readFileSync(envFilePath, { encoding: 'utf8' });
        const match = fileContent.match(new RegExp(`^${variableName}=(.*)`, "m"));
        return match ? match[1].trim().replace(/['"]/g, '') : null;
    } catch {
        return null;
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { currentPassword, newUsername, newPassword } = req.body;

    // 1. Xác thực mật khẩu hiện tại
    const currentPasswordHash = getEnvVariableFromFile('ADMIN_PASSWORD_HASH');
    if (!currentPasswordHash) {
        return res.status(500).json({ error: 'Không thể đọc cấu hình mật khẩu hiện tại.' });
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, currentPasswordHash);
    if (!isPasswordCorrect) {
        return res.status(401).json({ error: 'Mật khẩu hiện tại không chính xác.' });
    }

    // 2. Đọc toàn bộ nội dung tệp .env.local
    const envFilePath = path.resolve(process.cwd(), '.env.local');
    let envFileContent = fs.readFileSync(envFilePath, 'utf8');

    // 3. Cập nhật Username nếu có
    if (newUsername) {
        envFileContent = envFileContent.replace(/^ADMIN_USERNAME=.*/m, `ADMIN_USERNAME=${newUsername}`);
    }

    // 4. Băm và cập nhật Password nếu có
    if (newPassword) {
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        envFileContent = envFileContent.replace(/^ADMIN_PASSWORD_HASH=.*/m, `ADMIN_PASSWORD_HASH=${newPasswordHash}`);
    }

    // 5. Ghi lại nội dung mới vào tệp .env.local
    try {
        fs.writeFileSync(envFilePath, envFileContent);
        res.status(200).json({ message: 'Cập nhật tài khoản thành công! Server có thể cần khởi động lại để áp dụng thay đổi.' });
    } catch (error) {
        console.error("Lỗi khi ghi tệp .env.local:", error);
        res.status(500).json({ error: 'Không thể lưu cấu hình mới.' });
    }
};

export default handler;