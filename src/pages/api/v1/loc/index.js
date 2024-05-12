import { getDB } from '@/util/database'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
    const body = req.body;
    const user_email = req.headers.email
    const db = await getDB(); //디비 호출
    if (req.method === 'GET') {
        var returnValue = await db.collection('user').findOne({email:user_email});

        var locValue = await db.collection('loclist').find({ id: { $in: returnValue.loclist } }).toArray();
        res.status(200).json({list:returnValue.loclist, loc:locValue})
    }
}