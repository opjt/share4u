import { getDB } from '@/util/database'
import { ObjectId } from 'mongodb';
import moment from 'moment';
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
  const { id } = req.query; // api/v1/post/{id}
  const db = await getDB(); //디비 호출
  const user_email = req.headers.email

  if(req.method ==='GET') {
    // var result = await db.collection('loclist').findOne({id:id});
    
    var post = await db.collection('post').findOne({_id:new ObjectId(id)});
    console.log(post)
    var user = await db.collection('user').findOne({email:post.email});
    res.status(200).json({post:post, user:user})
  }
  if(req.method === 'POST') {
    try {
      // upload.single() 메서드로 하나의 파일 업로드 처리
      upload.array('image', 10)(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          console.error('Multer error:', err);
          return res.status(500).json({ error: 'Error uploading file' });
        } else if (err) {
          console.error('Unknown error:', err);
          return res.status(500).json({ error: 'Error uploading file' });
        }
        var {content} = req.body
  
        console.log(content)
        
        // 파일 업로드 성공
        const filePaths = req.files.map(file => file.filename);
        
        const newDocument = {
          content: content,
          email: user_email,
          id:id,
          images: filePaths,
          createdAt: moment().toISOString(),
        };
    
        await db.collection('post').insertOne(newDocument);

        console.log(filePaths)
        return res.status(200).json({ message: 'File uploaded successfully' });
      }); 
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ error: 'Error uploading file' });
    }
  }
  
};
