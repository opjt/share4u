'use client'

import { useEffect, useRef, useState } from "react";
import Header from "@/app/components/layout/header";
import '@/app/components/kmap.css'
import Axios from "@/util/axios";
import useKakaoMap from "@/app/hooks/useKakaoMap";
import useCustomLogin from '@/app/hooks/useCustomLogin'


export default function Kmap() {
  

  const searchValue = useRef();
    const [locList, setLocList] = useState([]);
    const [userLocList, setUserLocList] = useState([])
    const [viewMode, setViewMode] = useState()
    const { isLogin,getUser } = useCustomLogin();

    const [container, setContainer ] = useState(null)
    const {map, putMarker, kakao} = useKakaoMap(container)

    useEffect(() => {
        (async function () {
            const res = await Axios.get(`/api/v1/loc`)
            
            setUserLocList(res.data.list)
        })();
    },[])
    useEffect(() => {
        (async function () {
            const res = await Axios.get(`/api/v1/loc`)
            setMarkers(res.data.loc)
            // setLocList(res.data.loc)
        })();
    },[userLocList])
    const setMarkers = (places) => {
   
        if(!kakao) return

        const bounds = new kakao.maps.LatLngBounds()
        let markers = []
        for (var i = 0; i < places.length; i++) {

            var position = new kakao.maps.LatLng(places[i].y, places[i].x)
        
            var {marker, overlay} = putMarker(position)
            bounds.extend(new kakao.maps.LatLng(places[i].y, places[i].x))
            markers.push({place: places[i], marker: marker, overlay:overlay})
        }
        
        setLocList(markers)
        map.setBounds(bounds)
    }
    const handleSubmit = (event) => {
        event.preventDefault(); // 폼의 기본 동작인 전송을 막음
        handleClickSearch(); // 검색 함수 호출
        (async function () {
            var res = await Axios.get(`/api/h`)
            console.log(res)
          })();
    }

    const handleClickPlace = (value) => {
        console.log(value.marker)
        for (var i = 0; i < locList.length; i++) {
            locList[i].overlay.setMap(null);
        }
        
        map.panTo(value.marker.getPosition()); 
        value.overlay.setMap(map);

    }
  
    const handleClickHeart = async (place) => {
        // console.log(place)
        try {
            delete place._id
            const res = await Axios.post(`/api/v1/loc/${place.id}`, place)
            setUserLocList(res.data)
            
        } catch ({response}) {
            console.log(response)
            alert("로그인 후 이용 가능합니다")
        }
        

    }

  return (

    <>
      <Header handleSubmit={handleSubmit} searchValue={searchValue} setViewMode={setViewMode}/>
      <hr/>
      <div className="flex ">
      <div style={{ width: 'calc(100vw - 400px)', height: 'calc(100vh - 66px)' }} ref={setContainer}></div>

        <div className="flex-1 overflow-auto" style={{ height: "calc(100vh - 66px)" }}>
          <div className="p-2">
            <div className="font-semibold">
                전체 장소 {userLocList.length}
            </div>
            <hr/>
            <div className="w-full">
            {locList.map((value,index) => {
                return (
                <div key={index} className="py-2 border-b-2">
                    <div className="flex items-center cursor-pointer"  onClick={() => { handleClickPlace(value) }}>
                        <span className="font-bold   whitespace-nowrap">{value.place.place_name}</span>
                        <div className="pl-1 text-sm text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis ">{value.place.address_name}</div>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-sm text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis w-56">{value.place.category_name}</p>
                        <div className={`badge badge-md bg-red-400 text-white`} onClick={() => { handleClickHeart(value.place) }}>저장❤️</div>
                    </div>
                    
                </div>
                
                )
            })}
            </div>
          
            
          </div>
          {/* <ul className="">
            {locList.map((value, index) => {
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
            })}
          </ul> */}

        </div>
      </div>

 
    </>
  );
}


