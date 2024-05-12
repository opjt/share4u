import { getDB } from '@/util/database'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
    const body = req.body;
    const user_email = req.headers.email
    const db = await getDB(); //디비 호출
    if (req.method === 'GET') {
        var returnValue = await db.collection('user').findOne({email:user_email});
        
        const idList = returnValue.loclist.map(item => item.id);
        
        const transformedObject = returnValue.loclist.reduce((acc, obj) => {
            // id를 key로 사용하여 객체에 추가
            acc[obj.id] = obj;
            return acc;
        }, {});
          
        var locValue = await db.collection('loclist').find({ id: { $in: idList } }).toArray();
        const newArray = locValue.map(obj => ({ ...obj, tag:transformedObject[obj.id].tag }));
        res.status(200).json({list:idList, loc:newArray})
    }
}