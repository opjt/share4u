import { connectDB } from '@/util/database'

export default async function handler(req,res) {
    let db = (await connectDB).db('hr');
    let result = await db.collection('user').find().toArray();
    const movie = {
        title: 'Inception',
        year: 2010,
        director: 'Christopher Nolan'
    };
    var result2 = await db.collection('user').insertOne(movie);
        
        // 삽입된 문서의 ID 반환
    const insertedId = result2.insertedId;
    
  res.status(200).json(insertedId)
}