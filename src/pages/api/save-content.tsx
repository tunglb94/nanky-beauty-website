// Đây là API Route của Next.js (chỉ hoạt động trong môi trường Node.js)
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ chấp nhận phương thức POST.' });
  }

  const { lang, content } = req.body;
  
  // *** THÊM 'zh' VÀO DANH SÁCH NGÔN NGỮ HỢP LỆ ĐỂ LƯU ***
  const ALLOWED_LANGUAGES = ['vi', 'en', 'ru', 'kr', 'zh'];

  if (!lang || !content || !ALLOWED_LANGUAGES.includes(lang)) {
    return res.status(400).json({ error: 'Dữ liệu đầu vào không hợp lệ.' });
  }

  try {
    // Đường dẫn đến file JSON
    const filePath = path.join(process.cwd(), 'src', 'locales', `${lang}.json`);
    
    // Ghi nội dung JSON đã được định dạng vào file
    const jsonString = JSON.stringify(content, null, 2);
    
    // Ghi file đồng bộ
    fs.writeFileSync(filePath, jsonString, 'utf-8');

    res.status(200).json({ success: true, message: `Đã lưu thành công file ${lang}.json` });
  } catch (error) {
    console.error(`Lỗi khi ghi file ${lang}.json:`, error);
    // Trả về lỗi 500 nếu quá trình ghi file thất bại (ví dụ: thiếu quyền)
    res.status(500).json({ error: 'Lỗi máy chủ: Không thể ghi file. Kiểm tra quyền truy cập thư mục locales.' });
  }
};

export default handler;