import { getDB } from '@/util/database'

export default async function handler(req, res) {
    const body = req.body;
    const user_email = req.headers.email
    const db = await getDB(); //디비 호출
    if (req.method === 'GET') {
        
        const {value} = req.query;
        var returnValue = await db.collection('user').findOne({nickname:value});
        if(returnValue) {
            res.status(400).json({error:"존재하는 닉네임입니다"})
        }
        res.status(200).json(value)
    }
    if (req.method === 'PUT') {
        
        const {value} = req.body;
        var returnValue = await db.collection('user').findOne({nickname:value});
        if(returnValue) {
            res.status(400).json({error:"존재하는 닉네임입니다"})
        }
        var rest = await db.collection('user').updateOne({email:user_email}, {$set: {nickname:value}});
        res.status(200).json(rest)
    }
  
}