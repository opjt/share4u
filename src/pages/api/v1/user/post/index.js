import { getDB } from '@/util/database'

export default async function handler(req, res) {

    const { id } = req.query; // api/v1/loc/값
    const body = req.body;
    const user_email = req.headers.email
    const db = await getDB(); //디비 호출
    
    if(req.method === 'GET') {
        
        // var result = await db.collection('loclist').findOne({id:id});

        var posts = await db.collection('post').find({email:user_email}).sort({ createdAt: -1 }).toArray();
        
        res.status(200).json({post:posts})
    }
}