import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const galleryFilePath = path.join(process.cwd(), 'src', 'locales', 'gallery.json');

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // Lấy dữ liệu Gallery (phương thức GET)
  if (req.method === 'GET') {
    try {
      const fileContent = fs.readFileSync(galleryFilePath, 'utf-8');
      const galleryData = JSON.parse(fileContent);
      return res.status(200).json(galleryData);
    } catch (error) {
      console.error("Lỗi khi đọc file gallery.json:", error);
      return res.status(500).json({ error: 'Không thể đọc dữ liệu gallery.' });
    }
  }

  // Lưu dữ liệu Gallery (phương thức POST)
  if (req.method === 'POST') {
    try {
      const { galleryData } = req.body;
      if (!galleryData || !Array.isArray(galleryData)) {
        return res.status(400).json({ error: 'Dữ liệu không hợp lệ.' });
      }
      
      const jsonString = JSON.stringify(galleryData, null, 2);
      fs.writeFileSync(galleryFilePath, jsonString, 'utf-8');
      
      return res.status(200).json({ success: true, message: 'Đã lưu bộ sưu tập thành công!' });
    } catch (error) {
      console.error("Lỗi khi ghi file gallery.json:", error);
      return res.status(500).json({ error: 'Lỗi máy chủ: Không thể ghi file.' });
    }
  }

  // Báo lỗi nếu là phương thức khác
  return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
};

export default handler;