"use client"
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react';
import Header from "@/app/components/layout/header";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Axios from '@/util/axios';
import { useRouter } from "next/navigation";

export default function Page({ params }) {
  console.log(params)

  const [selectedImages, setSelectedImages] = useState([]);
  const [posts, setPosts] = useState(null)
  const fileInputRef = useRef();
  const inputData = useRef();
  const router = useRouter();

  useEffect(() => {
    (async function () {
      const res = await Axios.get(`/api/v1/user/post`)
      console.log(res.data)
      setPosts(res.data.post)


    })();
  }, [])
  const sliderSettings = {
    dots: true, // 이미지 개수 표출 점
    infinite: selectedImages && selectedImages.length > 1 ? true : false, // 마지막 이미지 이후 첫 이미지로 자동 루프 여부
    slidesToShow: 1, // 한번에 보여지는 슬라이드 수
    slidesToScroll: 1, // 한번에 넘어가는 슬라이드 수
    autoplay: false, // 자동 슬라이드 여부
    autoplaySpeed: 3000, // 자동으로 넘어가는 시간 간격
    arrows: false, // 좌,우 버튼
    pauseOnHover: true, // hover시 정지
    appendDots: (dots) => (
      <div>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
  };


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
              <p className="text-lg font-semibold">내 추억</p>
              {/* <p className="text-sm text-gray-600">{locInfo?.address_name}</p> */}
            </div>
            {/* <div className='btn btn-sm btn-neutral' onClick={() => (router.push(`/loc/${params.id}/post`))}>글쓰기</div> */}
          </div>

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