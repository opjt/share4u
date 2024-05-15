'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import Header from "@/app/components/layout/header";
import '@/app/components/kmap.css'
import Axios from "@/util/axios";
import useKakaoMap from "@/app/hooks/useKakaoMap";
import useCustomLogin from '@/app/hooks/useCustomLogin'
import { useSearchParams } from 'next/navigation'


export default function Kmap() {
    const [container, setContainer ] = useState(null)
    
    const cont = useRef();
    const [map, setMap] = useState(null)
    const [kakao, setKakao] = useState(null)
    useEffect(() => {


        window.kakao?.maps.load( async () => {
            setKakao(window.kakao)
            // console.log(mapContainer)
            var options = { 
                center: new window.kakao.maps.LatLng(33.451475, 126.570528), // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            }; 
           
            
            var map = new window.kakao.maps.Map(cont.current, options)

            var marker = new window.kakao.maps.Marker({
                map: map, 
                position: new window.kakao.maps.LatLng(33.450701, 126.570667)
            });

            const res = await Axios.get(`/api/v1/loc/26558163?limit=6`)
            
            const posts = res.data.post
            console.log(posts)
            

            const contDiv2 = `
            <div class="mt-[-120px]">
            <div class="card w-96 h-[400px] bg-base-100 shadow-xl trang ">
              <div class="card-body p-4">
            
                <div class='flex justify-between'> 
                    <div class='flex items-center gap-2 w-80 '>
                        <div class='font-bold'>마치광장</div>
                        <div class='text-gray-600 text-sm text-ellipsis whitespace-nowrap overflow-hidden'>대전광역시 서구 관저동</div>
                    </div>
                    <button class="btn btn-square btn-sm close right">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div class="py-3 grid grid-cols-3 gap-1" >

            ${posts.map(value =>  `
                <div class='w-full pb-[100%] bg-red-400 relative ' key={index} >
                <img class="absolute object-cover h-full w-full" src='/uploads/${value.images[0]}' alt="" />
                ${value.images.length > 1 ? `
                <div class='absolute right-0 font-semibold p-1'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18" />
                  </svg>
                </div>` : ''
              }

                  <div class='absolute opacity-0 hover:opacity-100 w-full h-full flex justify-center items-center'>
                    <div class='text-white absolute z-50'>♥</div>

                    <div class='bg-black opacity-15 w-full h-full'></div>

                  </div>


                </div>
              `).join('')}


          </div>
                
                
                <p >We are using cookies for no reason.</p>
              </div>
            </div>
                
            </div>
            `


            var contDiv = `
              <div class="mt-[-180px]">
              <div class="card w-96 h-28 bg-base-100 shadow-xl trang ">
                <div class="card-body p-4">
                  <div class='flex justify-between'> 
                      <div class='flex items-center gap-2 w-80 '>
                          <div class='font-bold'>마치광장</div>
                          <div class='text-gray-600 text-sm text-ellipsis whitespace-nowrap overflow-hidden'>대전광역시 서구 관저동 느리울마을</div>
                      </div>
                      <button class="btn btn-square btn-sm close right">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                   </div>
                   <div class="flex justify-between w-full">
                    <div class="flex gap-2">
                        <span class="badge badge-md badge-ghost">🖼️ 6</span> <span class="badge badge-md badge-ghost">❤️ 6</span>
                    </div>
                    <span class="btn btn-sm">상세 보기</span>
                </div>
              </div>
              </div>
            `
            
            var overlay = new window.kakao.maps.CustomOverlay({
                content: contDiv,    
                map: map,
                position: marker.getPosition()       
            });
            
            window.kakao.maps.event.addListener(marker, 'click', function () {
            
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = contDiv;
    
                const closeBtn = tempDiv.querySelector('.close');
                closeBtn.addEventListener('click', () => {
                    overlay.setMap(null);
                });
                overlay.setContent(tempDiv)
                overlay.setMap(map);
            });
        })
    }, [])
  

   
  return (

    <>
      <Header  />
      <hr/>
      <div className="flex ">
      <div style={{ width: 'calc(100vw - 400px)', height: 'calc(100vh - 66px)' }} ref={cont} ></div>

        <div className="flex-1 overflow-auto bg-black" style={{ height: "calc(100vh - 66px)" }}>
            <div className='h-[200px]'></div>
            <div class="mt-[-200px]">
                <div class="card w-96 bg-base-100 shadow-xl trang">
                <div class="card-body">
                    <div class="card-actions justify-end">
                    <button class="btn btn-square btn-sm close">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    </div>
                    <p>We are using cookies for no reason.</p>
                </div>
                </div>
                    
                </div>
       

        </div>
      </div>

 
    </>
  );
}


