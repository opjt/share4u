"use client"
import Image from 'next/image'
import  {useRef, useState,useEffect } from 'react';
import Header from "@/app/components/layout/header";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Axios from '@/util/axios';
import{ useRouter } from "next/navigation";

export default function Page({ params }) {
  console.log(params)

  const [selectedImages, setSelectedImages] = useState([]);
  const [locInfo, setLocInfo] = useState(null)
  const [posts, setPosts] = useState(null)
  const fileInputRef = useRef();
  const inputData = useRef();
  const router = useRouter();

  useEffect(() => {
    (async function () {
      const res = await Axios.get(`/api/v1/loc/${params.id}`)
      console.log(res.data)
      setLocInfo(res.data.place)
      setPosts(res.data.post)
 

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



  const handleImageChange = (event) => {
    const files = event.target.files;
    const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setSelectedImages(newImageUrls);
    // setSelectedImages(prevImages => [...prevImages, ...newImageUrls]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼의 기본 동작인 전송을 막음
    
    const formData = new FormData();

    // 새로운 파일 폼데이터로 변경
    const files = fileInputRef.current.files;
    for (let i = 0; i < files.length; i++) {
      formData.append("image", files[i]);
    }

    // 구장정보 폼데이터로 변경
    formData.append("content", inputData.current.value);

    const header = { headers: { "Content-Type": "multipart/form-data" } }
    var res = await Axios.post(`/api/v1/post/${locInfo.id}`, formData, header)
  }
  const handleClickPost = async(value) => {
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
          <div className='btn btn-sm btn-neutral' onClick={() => (router.push(`/loc/${params.id}/post`))}>글쓰기</div>
        </div>
        

        

          <div class="py-6 grid grid-cols-3 gap-1" >
            {posts?.map((value,index) => {
              return (
                <div className='w-full pb-[100%] bg-red-400 relative ' key={index} onClick={() => handleClickPost(value._id)}>
                  <Image className="absolute object-cover h-full" src={`/uploads/${value.images[0]}`} alt="" fill/>
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