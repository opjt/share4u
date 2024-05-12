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
  const router = useRouter();  
  // const [container, setContainer ] = useState(null)
  const [container, setContainer ] = useState(null)
  const {map, putMarker, kakao} = useKakaoMap(container)
  
  const searchValue = useRef();

  
  const [locList, setLocList] = useState([]);
  const [userLocList, setUserLocList] = useState([])
  const { isLogin,getUser } = useCustomLogin();

  const searchParams = useSearchParams() //query스트링 
  const search = searchParams.get('search')
    useEffect(() => {
      if(isLogin) {
        (async function () {
          const res = await Axios.get(`/api/v1/loc`)
          setUserLocList(res.data.list)
      })();
      }
    },[isLogin])
    useEffect(() => {
      if(!kakao) return
      if(!search) return
        console.log(search)
        console.log(kakao)
        handleClickSearch(search)
     
    },[kakao])



    const handleClickSearch = (search) => {
        var searchText = searchValue.current.value
        if(search) {
          searchText = search
        }
        router.push(`?search=${searchText}`);
        // 마커 초기화
        for (var i = 0; i < locList.length; i++) {
            locList[i].marker.setMap(null);
        }
        setLocList([])
        var ps = new kakao.maps.services.Places();
        ps.keywordSearch(searchText, (data, status, _pagination) => {
          if (status === kakao.maps.services.Status.OK) {
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
            // LatLngBounds 객체에 좌표를 추가합니다
            const bounds = new kakao.maps.LatLngBounds()
            let markers = []
            console.log(data);
            for (var i = 0; i < data.length; i++) {
   
              var position = new kakao.maps.LatLng(data[i].y, data[i].x)
           
              var {marker, overlay} = putMarker(position, data[i])
              bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
              markers.push({place: data[i], marker: marker, overlay:overlay})
            }
            
            setLocList(markers)
    
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
            map.setBounds(bounds)
          }  else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 존재하지 않습니다.');
            return;
        } else if (status === kakao.maps.services.Status.ERROR) {
            alert('검색 결과 중 오류가 발생했습니다.');
            return;
        }
        })
    }
    const handleSubmit = (event) => {
        event.preventDefault(); // 폼의 기본 동작인 전송을 막음
        handleClickSearch(); // 검색 함수 호출
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
      <Header handleSubmit={handleSubmit} searchValue={searchValue} />
      <hr/>
      <div className="flex ">
      <div style={{ width: 'calc(100vw - 400px)', height: 'calc(100vh - 66px)' }} ref={setContainer} ></div>

        <div className="flex-1 overflow-auto" style={{ height: "calc(100vh - 66px)" }}>

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


