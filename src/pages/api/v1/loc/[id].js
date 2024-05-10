import { connectDB } from '@/util/database'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
    const { id } = req.query; // api/v1/loc/값
    var session = await getSession({ req });
    if(!session) {
        res.status(401).json({ error: '계정을 찾을 수 없습니다' });
    }
    if (req.method === 'POST') {
        res.status(200).json(id)
    }
    res.status(200).json("안뇽")
}