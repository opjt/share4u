'use client'

import { useEffect, useRef, useState } from "react";
import Image from 'next/image'
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
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a className="btn btn-ghost text-lg">공유해유</a>
          </div>
          <div className="flex-none gap-2">
            <div className="form-control relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-2 right-2"width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#7b7b7b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="장소 검색" className="input input-bordered w-24 md:w-auto h-10" />
            </div>
          
            <div className="flex justify-center items-center gap-2 border-[1px] border-gray-300 rounded-box p-2 px-3 btn-ghost">
              <Image className="w-6 h-6" src={`/img/image.png`} alt="usericon" width="60" height="60" />
              <div className="text-stone-800 text-xs font-bold">로그인 및 회원가입</div>
            </div>
            {/* <div className="btn btn-ghost btn-circle avatar flex">
              <div className="w-8 rounded-full ">
                
                <Image src={`/img/image.png`} alt="usericon" width="60" height="60" />
              </div>
            </div> */}
          </div>
          </div>
          <hr/>
          <div className="flex">
            <div id="map" style={{ width: 'calc(100vw - 400px)', height: 'calc(100vh - 66px)' }}></div>
            <div className="flex-1">
                <ul className="">
                  <li className="p-1 flex gap-2 py-3 border-b-2">
                    <div className="skeleton w-28 h-28"></div>  
                    <div className="flex-1">
                      <h2 className="font-bold text-lg">정치망</h2>
                      <p className="text-sm text-gray-700">대전 서구 관저동 1688</p>
                      <p className="text-sm text-gray-700">{`음식점 > 한식 > 해물,생선 > 회`}</p>
                      <div className="text-right pr-2"><div className="badge badge-md border-red-400 text-red-400 ">987,654❤️</div></div>
                    </div>
                  </li>
                  <li className="p-1 flex gap-2 py-3 border-b-2">
                    <div className="skeleton w-28 h-28"></div>  
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
