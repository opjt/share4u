"use client"
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react';
import Header from "@/app/components/layout/header";
import Axios from '@/util/axios';
import { useRouter, useSearchParams } from "next/navigation";
import useCustomLogin from '@/app/hooks/useCustomLogin';
import axios from 'axios';

export default function Page({ params }) {
  console.log(params)

  const [selectedImages, setSelectedImages] = useState([]);
  const [locInfo, setLocInfo] = useState(null)
  const [posts, setPosts] = useState(null)
  const [userLocList, setUserLocList] = useState([])
  const { getUserLoc,isLogin } = useCustomLogin();
  const searchParams = useSearchParams() //query스트링 
  const fileInputRef = useRef();
  const inputData = useRef();
  const router = useRouter();

  useEffect(() => {
    (async function () {
      const res = await axios.get(`/api/v1/loc/${params.id}`)
      console.log(res.data)
      
      setLocInfo(res.data.place)
      if(res.data.place ==null ) {
        var location_info = {place_name: searchParams.get('place_name'),address_name:searchParams.get('address_name')}
        setLocInfo(location_info)
      } else {
        res.data.place.heart = res.data.count 
      }
      setPosts(res.data.post)
      setUserLocList(await getUserLoc()) //하트 표시하려고 한거


    })();
  }, [])

  const handleClickWrite = (locInfo) =>{
    if(!isLogin) {
      alert("로그인 후 이용 가능합니다")
      return
    }
    router.push(`/loc/${params.id}/post?place_name=${locInfo?.place_name}&address_name=${locInfo?.address_name}`)
    
  }
  const handleClickPost = async (value) => {
    router.push(`/post/${value}`)
  }

  return (
    <>
      <Header />

      <div class="flex items-center justify-center p-6">

        <div class="mx-auto w-full max-w-[550px] bg-white">

          <div className='flex justify-between'>
            <div>
              <p className="text-lg font-semibold">{locInfo?.place_name}</p>
              <p className="text-sm text-gray-600">{locInfo?.address_name}</p>
            </div>
            <div className='btn btn-sm btn-neutral' onClick={ () => handleClickWrite(locInfo)}> 글쓰기</div>
          </div>
          {/* <div className="text-right"><div className={`badge badge-md ${userLocList?.includes(params.id) ? 'bg-red-400 text-white' : 'border-red-400 text-red-400'}`} onClick={() => { handleClickHeart(locInfo) }}>저장 {locInfo?.heart}❤️</div></div> */}
          {posts?.length == 0 && (
            <div role="alert" className="alert mt-6 p-6">
            
            <span>아직 글이 없어요 첫번째 글을 작성해보세요</span>
            </div>
          )}
          <div class="py-6 grid grid-cols-3 gap-1" >

            {posts?.map((value, index) => {
              return (
                <div className='w-full pb-[100%] bg-red-400 relative ' key={index} onClick={() => handleClickPost(value._id)}>
                  <Image className="absolute object-cover h-full" src={`/uploads/${value.images[0]}`} alt="" fill />
                  {value.images.length > 1 && (
                    <div className='absolute right-0 font-semibold p-1'><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></svg></div>
                  )}

                  <div className='absolute opacity-0 hover:opacity-100 w-full h-full flex justify-center items-center'>
                    <div className='text-white absolute z-50'>♥</div>

                    <div className='bg-black opacity-15 w-full h-full'></div>

                  </div>


                </div>
              )
            })}


          </div>

        </div>
      </div>
    </>
  )
}