'use client'

import { useEffect, useRef, useState } from "react";
import Header from "@/app/components/layout/header";
import '@/app/components/kmap.css'
import Axios from "@/util/axios";
import useKakaoMap from "../hooks/useKakaoMap";
import useCustomLogin from '@/app/hooks/useCustomLogin'


export default function Kmap() {
  

  const searchValue = useRef();
    const [locList, setLocList] = useState([]);
    const [userLocList, setUserLocList] = useState([])
    const [viewMode, setViewMode] = useState()
    const { isLogin,getUser } = useCustomLogin();
    const [isVisible, setVisible] = useState()

    const [container, setContainer ] = useState(null)
    const {map, putMarker} = useKakaoMap(container)


    const handleClickSearch = () => {
        console.log(searchValue.current.value);
        //마커 초기화
        // for (var i = 0; i < locList.length; i++) {
        //     locList[i].marker.setMap(null);
        // }
        setLocList([])
        var ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(searchValue.current.value, (data, status, _pagination) => {
          if (status === kakao.maps.services.Status.OK) {
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
            // LatLngBounds 객체에 좌표를 추가합니다
            const bounds = new kakao.maps.LatLngBounds()
            let markers = []
            console.log(data);
            for (var i = 0; i < data.length; i++) {
              var marker =  {
                position: {
                  lat: data[i].y,
                  lng: data[i].x,
                },
                content: data[i].place_name,visible:false
              }
              var position = new kakao.maps.LatLng(data[i].y, data[i].x)
              putMarker(position)
              // @ts-ignore
              bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
              markers.push({place: data[i], marker: marker})
            }
            
            setLocList(markers)
    
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
            map.setBounds(bounds)
          }
        })
    }
    const handleSubmit = (event) => {
        event.preventDefault(); // 폼의 기본 동작인 전송을 막음
        handleClickSearch(); // 검색 함수 호출
        (async function () {
            var res = await Axios.get(`/api/h`)
            console.log(res)
          })();
    }
    const  closeOverlay = (placePosition) => {
        var overlay = new kakao.maps.CustomOverlay({
            position: placePosition     
        });
        overlay.setMap(null);     
    }
    const handleClickPlace = (value) => {
        console.log(value)
        for (var i = 0; i < locList.length; i++) {
            locList[i].infowindow.setMap(null);
        }
        map.panTo(value.marker.getPosition()); 
        value.infowindow.setMap(map);

    }
    const handleClickMarker = (value) => {
      console.log(value)
      locList[value].marker.visible = true;
      setVisible(value)
      setLocList(locList)
    }
    const handleClickHeart = async (place) => {
        // console.log(place)
        try {
            const res = await Axios.post(`/api/v1/loc/${place.id}`, place)
            setUserLocList(res.data)
            console.log(res)
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
          {/* 로그인되어있을 경우 유저 장소 표시 */}
          {isLogin && (
            <>
              {viewMode}
            </>
          )}
          <ul className="">
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
          </ul>

        </div>
      </div>

 
    </>
  );
}


