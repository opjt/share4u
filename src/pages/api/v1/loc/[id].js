import { getDB } from '@/util/database'

export default async function handler(req, res) {

    const { id } = req.query; // api/v1/loc/값
    const body = req.body;
    const user_email = req.headers.email
    const db = await getDB(); //디비 호출

    // if(!session) {
    //     res.status(401).json({ error: '계정을 찾을 수 없습니다' });
    // }
    if(req.method === 'GET') {
        // const result = await db.collection('user').countDocuments({loclist: {$elemMatch: {$eq: id }}});
        // res.status(200).json(result)

        var result = await db.collection('loclist').findOne({id:id});

        var posts = await db.collection('post').find({id:id}).sort({ createdAt: -1 }).toArray();
        
        res.status(200).json({place: result,post:posts})
    }
    if(req.method==='PATCH') {
        var result = await db.collection('user').updateOne(
            { email: user_email, "loclist.id": id }, // 조건: 이메일이 일치하고 loclist 배열에 해당 id를 가진 객체가 있는지 확인
            { $set: { "loclist.$.tag": body.value } } // loclist 배열 내에서 해당 id를 가진 객체의 tag 값을 변경
          );
        res.status(200).json(result)
    }
    if (req.method === 'POST') {

        await db.collection('loclist').updateOne({id:body.id}, {$set: body}, { upsert: true }) //장소전체목록에 추가


        // 배열에 값이 있는지 확인하는 쿼리 실행
        var {loclist} = await db.collection('user').findOne({ email: user_email});
        const idExists = loclist.some(item => item.id === id);
        if(!idExists) { //값이 없으면
            var update = {
                $addToSet: { loclist: {id:id,tag:[]} } // 배열에 값이 없으면 추가
            };
            var result = await db.collection('user').updateOne({ email: user_email}, update);

        } else { //값이 있으면
            var update = {
                $pull: { loclist: {id:id} } // 배열에 값이 없으면 추가
            };
            var result = await db.collection('user').updateOne({ email: user_email}, update);

        }
        var {loclist} = await db.collection('user').findOne({ email: user_email});
        const idList = loclist.map(item => item.id);
        console.log(idList)
        
        res.status(200).json(idList)
    }
}