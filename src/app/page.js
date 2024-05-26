'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import Header from "@/app/components/layout/header";
import '@/app/components/kmap.css'
import Axios from "@/util/axios";
import useKakaoMap from "@/app/hooks/useKakaoMap";
import useCustomLogin from '@/app/hooks/useCustomLogin'
import { useSearchParams } from 'next/navigation'
import axios from 'axios';
import Image from 'next/image';
import moment from 'moment';


export default function Kmap() {
  const router = useRouter();  
  // const [container, setContainer ] = useState(null)
  const [container, setContainer ] = useState(null)
  const {map, putMarker, kakao,customOverlay} = useKakaoMap(container)
  
  const searchValue = useRef();

  const [locValue, setLocValue] = useState([])
  const [locList, setLocList] = useState([]);
  const [userLocList, setUserLocList] = useState([])
  const { isLogin,getUser } = useCustomLogin();

  const [post,setPost] = useState([])

    useEffect(() => {
      (async function () {
        const res = await axios.get(`/api/v1/loc`)
        setLocValue(res.data)
        
      })();
    },[])
    useEffect(() => {
      if(!kakao) return
      (async function () {
        const res = await axios.get(`/api/v1/post`)
        console.log(res.data.post)
        setPost(res.data.post)
        
        // setMarkers()
        
      })();
      
        
     
    },[kakao, locValue])

    const setMarkers = () => {
  
      for (var i = 0; i < locList.length; i++) {
          locList[i].marker.setMap(null);
      }
      setLocList([])
      const bounds = new kakao.maps.LatLngBounds()
      let markers = []

      Object.keys(locValue).forEach(key => {
        var data = locValue[key];
        var position = new kakao.maps.LatLng(data.y, data.x)
        
        var {marker, overlay} = putMarker(position, data)
        bounds.extend(new kakao.maps.LatLng(data.y, data.x))
        markers.push({place: data, marker: marker, overlay:overlay})
      });
  
      setLocList(markers)

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds)
      
  }
    const handleClickPlace = async (value) => {
        console.log(value)
        for (var i = 0; i < locList.length; i++) {
            locList[i].overlay.setMap(null);
        }
        let markers = []

        var position = new kakao.maps.LatLng(value.y, value.x)
        var {marker, overlay} = putMarker(position, value)
        markers.push({place: value, marker:marker, overlay:overlay})
        var cont = await customOverlay(value, overlay)
        map.panTo(marker.getPosition()); 
        overlay.setContent(cont)
        overlay.setMap(map);
        setLocList(markers)

    }
  
    const handleClickHeart = async (place) => {
        // console.log(place)
        try {
            const res = await Axios.post(`/api/v1/loc/${place.id}`, place)
            setUserLocList(res.data)
            console.log(res.data)
        } catch ({response}) {
            console.log(response)
            alert("로그인 후 이용 가능합니다")
        }
        

    }

  return (

    <>
      <Header  />
      <hr/>
      <div className="flex ">
      <div style={{ width: 'calc(100vw - 400px)', height: 'calc(100vh - 66px)' }} ref={setContainer} ></div>

        <div className="flex-1 overflow-auto" style={{ height: "calc(100vh - 66px)" }}>

          <ul className="">
            {/* {locList.length == 0 && (
              <p className='text-lg font-bold text-center mt-5'>검색하여 서비스를 시작해보세요</p>
            )} */}
            {post.map((value, index) => {
              return (
                <li key={index} className="p-2  gap-3 py-3 border-b-2" >
                  <div className="flex items-center mb-2 gap-1">
                      <h2 className="font-bold text-lg cursor-pointer inline-block" onClick={() => { handleClickPlace(locValue[value.id]) }}>{locValue[value.id]?.place_name}</h2>
                      <p className="inline-block text-sm text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis w-64">{locValue[value.id]?.address_name}</p>
                  </div>
                  <div className='flex'>
                    <div className="w-24 h-24">
                      <div className='w-full pb-[100%] bg-red-400 relative '>
                          <Image className="absolute object-cover h-full" src={`/uploads/${value?.images[0]}`} alt="" fill />
                          {value.images.length > 1 && (
                            <div className='absolute right-0 font-semibold p-1 '><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></svg></div>
                          )}

                          <div className='absolute opacity-0 hover:opacity-100 w-full h-full flex justify-center items-center'>
                            <div className='text-white absolute z-50'>♥</div>

                            <div className='bg-black opacity-15 w-full h-full'></div>

                          </div>


                        </div>
                    </div>
                    <div className='flex-grow'>
                      <div className='text-end text-sm'>{moment(value?.createdAt).format('YYYY-MM-DD')}</div>  
                      <div className='flex items-center p-2'> 
                        
                        <div className='font-bold mr-1'>{value?.nickname}</div>
                        <div className='overflow-hidden whitespace-nowrap text-ellipsis w-56'>{value?.content}</div>
                      </div>
                    </div>
                    
                  </div>
                </li>
              );
            })}
            
            {/* {locList.map((value, index) => {
              return (
                <li key={index} className="p-2 flex gap-3 py-3 border-b-2" >
                  <div className="skeleton w-24 h-24"></div>
                  <div className="flex-1">
                    <h2 className="font-bold text-lg cursor-pointer" onClick={() => { handleClickPlace(value) }}>{value.place.place_name}</h2>
                    <p className="text-sm text-gray-700">{value.place.address_name}</p>
                    <p className="text-sm text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis w-56">{value.place.category_name}</p>
                    <div className="text-right pr-2"><div className={`badge badge-md ${userLocList.includes(value.place.id) ? 'bg-red-400 text-white' : 'border-red-400 text-red-400'}`} onClick={() => { handleClickHeart(value.place) }}>저장❤️</div></div>
                  </div>
                </li>
              );
            })} */}
          </ul>

        </div>
      </div>

 
    </>
  );
}


