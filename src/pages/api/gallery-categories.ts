import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const categoriesFilePath = path.join(process.cwd(), 'src', 'locales', 'gallery-categories.json');

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // Lấy danh sách danh mục (GET)
  if (req.method === 'GET') {
    try {
      const fileContent = fs.readFileSync(categoriesFilePath, 'utf-8');
      const data = JSON.parse(fileContent);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Không thể đọc dữ liệu danh mục.' });
    }
  }

  // Lưu danh sách danh mục (POST)
  if (req.method === 'POST') {
    try {
      const { categories } = req.body;
      if (!categories || !Array.isArray(categories)) {
        return res.status(400).json({ error: 'Dữ liệu không hợp lệ.' });
      }
      
      const jsonString = JSON.stringify(categories, null, 2);
      fs.writeFileSync(categoriesFilePath, jsonString, 'utf-8');
      
      return res.status(200).json({ success: true, message: 'Đã lưu danh mục thành công!' });
    } catch (error) {
      return res.status(500).json({ error: 'Lỗi máy chủ: Không thể ghi file.' });
    }
  }

  return res.status(405).json({ error: 'Phương thức không được hỗ trợ.' });
};

export default handler;