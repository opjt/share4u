import { getDB } from '@/util/database'

export default async function handler(req,res) {
    const db = await getDB();
    // const valueToCheck = 30;

    // // 확인할 조건 정의
    // const filter = {
    //     email: 'kiahohoho@naver.com',
    //     loclist: { $elemMatch: { $eq: valueToCheck } } // loclist 배열 필드에서 valueToCheck와 일치하는 요소 확인
    // };

    // // 배열에 값이 있는지 확인하는 쿼리 실행
    // const userWithMatchingValue = await db.collection('user').findOne(filter);
    let result = await db.collection('user').findOne({email:"kiahohoho@naver.com"});
    console.log(result)
    
  res.status(200).json(result)
}