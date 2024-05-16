import { getDB } from '@/util/database'
import { ObjectId } from 'mongodb';
import moment from 'moment';

  
export default async function handler(req, res) {
  const { id } = req.query; // api/v1/post/{id}
  const db = await getDB(); //디비 호출
  const user_email = req.headers.email

  if(req.method ==='GET') {
    // var result = await db.collection('loclist').findOne({id:id});
    
    var posts = await db.collection('post').find().sort({ createdAt: -1 }).toArray();
    
    res.status(200).json({post:posts})
  }
 
  
};
