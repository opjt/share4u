"use client"
import Image from 'next/image'
import  {useRef, useState,useEffect } from 'react';
import Header from "@/app/components/layout/header";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Axios from '@/util/axios';
import{ useRouter } from "next/navigation";
import Skeleton from '@/app/components/skeleton';

export default function Page({ params }) {
  console.log(params)

  const [selectedImages, setSelectedImages] = useState([]);
  const [locInfo, setLocInfo] = useState(null)
  const [post, setPost] = useState(null)
  const [user, setUser] = useState(null)
  const fileInputRef = useRef();
  const inputData = useRef();
  const router = useRouter();

  useEffect(() => {
    (async function () {
      const res = await Axios.get(`/api/v1/post/${params.id}`)
      setPost(res.data.post)
      setUser(res.data.user)

      const loc = await Axios.get(`/api/v1/loc/${res.data.post.id}`)
      setLocInfo(loc.data.place)

 

    })();
  },[])
  const sliderSettings = {
    dots: true, // 이미지 개수 표출 점
    infinite: selectedImages && selectedImages.length  > 1 ? true : false, // 마지막 이미지 이후 첫 이미지로 자동 루프 여부
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




  return (
    <>
      <Header />

      <div className="flex items-center justify-center p-6">
        
        <div className="mx-auto w-full max-w-[550px] bg-white">

        <div className='flex justify-between'>
          <div>
          
          <p className="text-lg font-semibold">{locInfo?.place_name}</p>
          <p className="text-sm text-gray-600">{locInfo?.address_name}</p>
              
            
            
          </div>
          <div className='btn btn-sm btn-neutral' onClick={() => (router.back())}>이전</div>
        </div>

          <div className="py-6 px-9" >
         
           

            <div className='border-b-2 '>
              <Slider {...sliderSettings} className=''>
                {post?.images.map((value, index) => (
                  <div key={index} className="h-[478px] ">
                    {console.log(value)}
                    <Image key={index} src={`/uploads/${value}`} alt={`Preview ${index}`} onError={(e) => ( e.target.src = '/img/default.png')} className="h-full w-full object-scale-down" width="478" height="478"/>
    
                  </div>
                ))}
              </Slider>
            </div>
            <div className="mb-6 pt-4">
        


              <div className="mb-7">
                <div className='flex items-center'> 
                  <div className='font-bold mr-1'>{user?.nickname}</div>
                  <div>{post?.content}</div>
                </div>
                
              </div>

           
            </div>

      
          </div>
        </div>
      </div>
    </>
  )
}