"use client"

import  {useRef, useState,useEffect } from 'react';
import Header from "@/app/components/layout/header";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Axios from '@/util/axios';
import{ useRouter, useSearchParams } from "next/navigation";
import axios from 'axios';

export default function Page({ params }) {
  console.log(params)

  const [selectedImages, setSelectedImages] = useState([]);
  const [locInfo, setLocInfo] = useState(null)
  const fileInputRef = useRef();
  const searchParams = useSearchParams() //query스트링 
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
      }
 

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
    const files = fileInputRef.current.files;
    
    if(files.length == 0) {
      alert("사진을 올려주세요")
      return
    }
    if(inputData.current.value.trim() == '') {
      alert("글을 입력해주세요")
      return
    }
    const formData = new FormData();

    // 새로운 파일 폼데이터로 변경
    
    for (let i = 0; i < files.length; i++) {
      formData.append("image", files[i]);
    }

    // 구장정보 폼데이터로 변경
    formData.append("content", inputData.current.value);

    const header = { headers: { "Content-Type": "multipart/form-data" } }
    var res = await Axios.post(`/api/v1/post/${locInfo.id}`, formData, header)
    
    alert("작성 완료")
    router.push(`/loc/${params.id}`)

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
          <div className='btn btn-sm btn-neutral' onClick={() => (router.back())}>이전</div>
        </div>

          <form class="py-6 px-9" onSubmit={handleSubmit}>
            {selectedImages.length == 0 && (
              <div class="mb-1">
                {/* <input type="file" accept="image/*" name="file" id="file" className="sr-only" onChange={handleImageChange} ref={fileInputRef} multiple /> */}
              <label for="file" class="relative flex  h-[478px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center " 
              onClick={() => fileInputRef.current.click}>
                <div>

                  <span class="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium ">
                    이미지
                  </span>
                </div>
              </label>
              </div>
            )}
           

            <div className='border-b-2 '>
              <Slider {...sliderSettings} className=''>
                {selectedImages.map((imageUrl, index) => (
                  <div key={index} className="h-[478px]">
     
                    <img key={index} src={imageUrl} alt={`Preview ${index}`}  className="h-full w-full object-scale-down" />
    
                  </div>
                ))}
              </Slider>
            </div>
            <div class="mb-6 pt-4">
              {/* <label class="mb-2 block text-lg font-semibold ">
                사진 등록
              </label> */}
              
              <input type="file" accept="image/*" name="file" id="file" className="file-input w-full max-w-xs mb-2" onChange={handleImageChange} ref={fileInputRef}  multiple />

              
        


              {/* <div class="mb-5 rounded-md bg-[#F5F7FB] py-4 px-8">
                <div class="flex items-center justify-between">
                  <span class="truncate pr-3 text-base font-medium ">
                    banner-design.png
                  </span>
                  <button class="">
                    <svg width="10" height="10"viewBox="0 0 10 10"fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z" fill="currentColor" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div> */}

              <div class="mb-5">
                <textarea type="email" name="email" id="email" placeholder="이곳의 기억은 어땠나요" class="w-full textarea textarea-bordered" ref={inputData}/>
              </div>

           
            </div>

            <div>
              <button class="btn btn-neutral w-full">추억 저장</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}