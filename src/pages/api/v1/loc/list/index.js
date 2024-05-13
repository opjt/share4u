import { getDB } from '@/util/database'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
    const body = req.body;
    const user_email = req.headers.email
    const db = await getDB(); //디비 호출
    if (req.method === 'GET') {
        var returnValue = await db.collection('user').findOne({email:user_email});

        res.status(200).json(returnValue.taglist)
    }
    if (req.method === 'POST') {
        console.log(body)
        var returnValue = await db.collection('user').findOne({email:user_email});
        if(returnValue.taglist.includes(body.name)) {
            res.status(401).json({error:"이미 존재하는 리스트 이름입니다"})
        }
        var update = {
            $addToSet: { taglist: body.name } // 배열에 값이 없으면 추가
        };
        var result = await db.collection('user').updateOne({ email: user_email}, update);

        res.status(200).json(result)
    }
}