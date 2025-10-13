import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Tắt body parser mặc định của Next.js để Formidable xử lý file
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Chỉ chấp nhận phương thức POST.' });
  }

  const form = formidable({ 
    uploadDir: path.join(process.cwd(), 'public', 'images', 'uploads'), // Thư mục đích
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  });

  try {
    // Đảm bảo thư mục uploads tồn tại
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ success: false, error: 'Không tìm thấy file.' });
    }

    // Tạo URL công khai
    const newFileName = path.basename(file.filepath);
    const publicUrl = `/images/uploads/${newFileName}`;
    
    // Đổi tên file tạm thời sang tên cuối cùng trong thư mục public
    const finalPath = path.join(uploadDir, newFileName);
    fs.renameSync(file.filepath, finalPath); 

    res.status(200).json({ 
        success: true, 
        message: 'Upload thành công.', 
        url: publicUrl 
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, error: 'Lỗi máy chủ trong quá trình xử lý file.' });
  }
};

export default handler;