
import { connectDB } from '@/util/database'
import { getSession } from 'next-auth/react'
export default async function handler(req,res) {
    // const session = await getServerSession(req, res, authOptions)
    var session = await getSession({ req });
    // console.log(session)
    console.log(session)

  res.status(200).json("안뇽")
}