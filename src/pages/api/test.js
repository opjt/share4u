import { getDB} from '@/util/database'

export default async function handler(req,res) {
    const db = await getDB();
    let result = await db.collection('user').findOne({name:"kiahohoho@navedr.com"});
    
    console.log(result)
    
  res.status(200).json(result)
}