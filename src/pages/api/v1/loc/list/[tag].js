import { getDB } from '@/util/database'

export default async function handler(req, res) {
    const { tag } = req.query; // api/v1/loc/값
    const body = req.body;
    const user_email = req.headers.email
    const db = await getDB(); //디비 호출
    var user = await db.collection('user').findOne({email:user_email});
    if(!user.taglist.includes(tag)) {
        return res.status(401).json({error:"찾을 수 없는 리스트입니다"})
    }

    if(req.method === 'PATCH') {
        if(user.taglist.includes(body.value)) {
            return res.status(401).json({error:"중복되는 리스트 입니다"})
        }
        await db.collection('user').updateOne(
            { email: user_email }, // 이메일이 일치하는 문서 선택
            { $set: { "taglist.$[tagIndex]": body.value } }, // taglist 배열의 특정 요소의 값을 변경
            { arrayFilters: [{ "tagIndex": tag }] } // 배열 필터를 사용하여 특정 조건에 맞는 요소만 업데이트
        )

        await db.collection('user').updateMany(
            { email: user_email, "loclist.tag": tag }, // 이메일이 일치하고 loclist.tag 배열에 "감성"이 포함된 문서 선택
            { $set: { "loclist.$[elem].tag.$[tagIndex]": body.value } }, // loclist.tag 배열에서 "감성"을 "맛집"으로 변경
            { arrayFilters: [{"elem.tag" :tag},{ "tagIndex": tag }] } // 배열 필터를 사용하여 특정 조건에 맞는 요소만 업데이트
        )
        

    }
    if (req.method === 'DELETE') {
        console.log(tag)
        
        var result = await db.collection('user').updateOne({ email: user_email}, {$pull: { taglist: tag } });
        await db.collection('user').updateMany(
            { email: user_email }, // 이메일이 일치하고 loclist.tag 배열에 "감성"이 포함된 문서 선택
            { $pull: { "loclist.$[].tag": tag } } // loclist.tag 배열에서 "감성" 요소 제거
         )
    }
    if (req.method === 'POST') {

    }
    var result = await db.collection('user').findOne({email:user_email});
    return res.status(200).json(result.taglist)
}