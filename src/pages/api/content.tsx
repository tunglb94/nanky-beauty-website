// Đây là API Route của Next.js (chỉ hoạt động trong môi trường Node.js)
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { lang } = req.query;
  
  // *** THÊM 'zh' VÀO DANH SÁCH NGÔN NGỮ HỢP LỆ ***
  const ALLOWED_LANGUAGES = ['vi', 'en', 'ru', 'kr', 'zh'];

  if (!lang || Array.isArray(lang) || !ALLOWED_LANGUAGES.includes(lang)) {
    return res.status(400).json({ error: 'Ngôn ngữ không hợp lệ.' });
  }

  try {
    // Đường dẫn đến file JSON
    const filePath = path.join(process.cwd(), 'src', 'locales', `${lang}.json`);
    
    // Đọc file đồng bộ
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    res.status(200).json(jsonData);
  } catch (error) {
    console.error(`Lỗi khi đọc file ${lang}.json:`, error);
    res.status(500).json({ error: 'Không thể đọc dữ liệu dịch thuật.' });
  }
};

export default handler;