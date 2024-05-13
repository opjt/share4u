const multer = require('multer');
const path = require('path');

export const config = {
    api: {
      externalResolver: true,
      bodyParser: false
    },
  };

// Multer 설정
const upload = multer({
    storage: multer.diskStorage({
      destination: './public/uploads',
      filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
      },
    }),
  });
  
  
export default async function handler(req, res) {
  try {
    // upload.single() 메서드로 하나의 파일 업로드 처리
    upload.array('image', 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(500).json({ error: 'Error uploading file' });
      } else if (err) {
        console.error('Unknown error:', err);
        return res.status(500).json({ error: 'Error uploading file' });
      }

      // 파일 업로드 성공
      const filePaths = req.files.map(file => file.path);
      console.log(filePaths)
      return res.status(200).json({ message: 'File uploaded successfully' });
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ error: 'Error uploading file' });
  }
};
