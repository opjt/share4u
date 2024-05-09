'use client'

import { useEffect, useRef, useState } from "react";

// import './kmap.css'

let map;

export default function Kmap() {
    const searchValue = useRef();
    useEffect(() => {
        const kakaoMapScript = document.createElement('script')
        kakaoMapScript.async = false
        kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&autoload=false&libraries=services`
        document.head.appendChild(kakaoMapScript)
      
        const onLoadKakaoAPI = () => {
          window.kakao.maps.load(() => {
            var container = document.getElementById('map')
            var options = {
              center: new window.kakao.maps.LatLng(33.450701, 126.570667),
              level: 3,
            }
            map = new kakao.maps.Map(container, options); // 전역 map 변수에 할당
          })
        }
      
        kakaoMapScript.addEventListener('load', onLoadKakaoAPI)
      }, [])
  
    return (
        <>
        
          <hr/>
          <div className="flex">
            <div id="map" style={{ width: 'calc(100vw - 400px)', height: 'calc(100vh - 66px)' }}></div>
            <div className="flex-1">
                <ul className="">
                  <li className="p-2 flex gap-3 py-3 border-b-2">
                    <div className="skeleton w-24 h-24"></div>  
                    <div className="flex-1">
                      <h2 className="font-bold text-lg">정치망</h2>
                      <p className="text-sm text-gray-700">대전 서구 관저동 1688</p>
                      <p className="text-sm text-gray-700">{`음식점 > 한식 > 해물,생선 > 회`}</p>
                      <div className="text-right pr-2"><div className="badge badge-md border-red-400 text-red-400 ">987,654❤️</div></div>
                    </div>
                  </li>
                  <li className="p-2 flex gap-3 py-3 border-b-2">
                    <div className="skeleton w-24 h-24"></div>  
                    <div className="flex-1">
                      <h2 className="font-bold text-lg">정치망</h2>
                      <p className="text-sm text-gray-700">대전 서구 관저동 1688</p>
                      <p className="text-sm text-gray-700">{`음식점 > 한식 > 해물,생선 > 회`}</p>
                      <div className="text-right pr-2"><div className="badge badge-md border-red-400 text-red-400 ">987,654❤️</div></div>
                    </div>
                  </li>
                </ul>

            </div>
          </div>
			
				{/* <div className="fixed bg-white w-16 z-20  h-full shadow-lg">
				<div>
          <div className="text-lg font-bold m-2 text-center leading-5">공유해유</div>
        </div>
        <hr/>
			</div>

      <div className="fixed bg-white mt-2 z-20 left-[74px]  shadow-lg">
        <div className="rounded-box absolute">
          <input className="focus:outline-none caret-transparent p-2 rounded-box" spellCheck="false"></input>

        </div>
			</div> */}
         
        </>
    );
}
