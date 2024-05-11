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
        const result = await db.collection('user').countDocuments({loclist: {$elemMatch: {$eq: id }}});
        res.status(200).json(result)
    }
    if (req.method === 'POST') {

        await db.collection('loclist').updateOne({id:body.id}, {$set: body}, { upsert: true }) //장소전체목록에 추가

        const filter = {
            email: user_email,
            loclist: { $elemMatch: { $eq: id } } // loclist 배열 필드에서 valueToCheck와 일치하는 요소 확인
        };
        // 배열에 값이 있는지 확인하는 쿼리 실행
        var userWithMatchingValue = await db.collection('user').findOne(filter);
        console.log(userWithMatchingValue)
        if (userWithMatchingValue) { //값이 있으면 
            var update = {
                $pull: { loclist: id } // 배열에서 값 제거
            };
            // 배열 업데이트
            var result = await db.collection('user').updateOne(filter, update);
        } else {
            var update = {
                $addToSet: { loclist: id } // 배열에 값이 없으면 추가
            };
            // 배열 업데이트
            var result = await db.collection('user').updateOne({ email: user_email }, update);
        }

        var returnValue = await db.collection('user').findOne({email:user_email});
        res.status(200).json(returnValue.loclist)
    }
}