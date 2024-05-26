import { useEffect, useState } from "react"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Axios from "@/util/axios";
import axios from "axios";

const useKakaoMap = (mapContainer) => {
    const [map, setMap] = useState(null)
    const [kakao, setKakao] = useState(null)
    const [services, setServices] = useState(null)
    const router = useRouter();  

    const customOverlay2 = (data) => {
        var overlay = new kakao.maps.CustomOverlay();
        if(!data) return overlay
        var contDiv = `
            <div class="mt-[-180px]">
              <div class="card w-96 h-28 bg-base-100 shadow-xl trang ">
                <div class="card-body p-4">
                  <div class='flex justify-between'>
                      <div class='flex items-center gap-2 w-80 '>
                          <div class='font-bold'>${data.place_name}</div>
                          <div class='text-gray-600 text-sm text-ellipsis whitespace-nowrap overflow-hidden'>${data.address_name}</div>
                      </div>
                      <button class="btn btn-square btn-sm close right">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                       </button>
                  </div>
                  <div class="flex justify-between w-full">
                    <div class="flex gap-2">
                        <span class="badge badge-md badge-ghost">🖼️ ${data.postCount}</span> <span class="badge badge-md badge-ghost">❤️ ${data.heartCount}</span>
                    </div>
                    <span class="btn btn-sm showdetail">상세 보기</span>
                   </div>
                </div>
              </div>
            </div>
            `
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contDiv;

        const closeBtn = tempDiv.querySelector('.close');
        closeBtn.addEventListener('click', () => { //닫기 이벤트 추가
            overlay.setMap(null);
        });   
        const clickBtn = tempDiv.querySelector('.showdetail');
        clickBtn.addEventListener('click', () => { //닫기 이벤트 추가
            router.push(`/loc/${data.id}`)
        });     
        overlay.setContent(tempDiv)
        return overlay
    }
    const customOverlay = async (data, overlay) => {
        if(!data) return 
        const res = await axios.get(`/api/v1/loc/${data.id}`)
        data.heartCount = res.data.count
        data.postCount = res.data.post.length
        var contDiv = `
            <div class="mt-[-180px]">
              <div class="card w-96 h-28 bg-base-100 shadow-xl trang ">
                <div class="card-body p-4">
                  <div class='flex justify-between'>
                      <div class='flex items-center gap-2 w-80 '>
                          <div class='font-bold'>${data.place_name}</div>
                          <div class='text-gray-600 text-sm text-ellipsis whitespace-nowrap overflow-hidden'>${data.address_name}</div>
                      </div>
                      <button class="btn btn-square btn-sm close right">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                       </button>
                  </div>
                  <div class="flex justify-between w-full">
                    <div class="flex gap-2">
                        <span class="badge badge-md badge-ghost">🖼️ ${data.postCount}</span> <span class="badge badge-md badge-ghost">❤️ ${data.heartCount}</span>
                    </div>
                    <span class="btn btn-sm showdetail">상세 보기</span>
                   </div>
                </div>
              </div>
            </div>
            `
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contDiv;

        const closeBtn = tempDiv.querySelector('.close');
        closeBtn.addEventListener('click', () => { //닫기 이벤트 추가
            overlay.setMap(null);
        });   
        const clickBtn = tempDiv.querySelector('.showdetail');
        clickBtn.addEventListener('click', () => { 

            router.push(`/loc/${data.id}?place_name=${data.place_name}&address_name=${data.address_name}`)
        });     
        return tempDiv
    }

    const putMarker = (position, data, clickEvent) => {
        var imageSrc = '/img/marker.png', // 마커이미지의 주소입니다   342 512  171 256  85 128
        imageSize = new kakao.maps.Size(25, 37), // 마커이미지의 크기입니다
        imageOption = {offset: new kakao.maps.Point(12, 40)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
            
        // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: position, // 마커의 위치
            image:markerImage
        });

        // 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 인포윈도우를 표시합니다 
        // window.kakao.maps.event.addListener(marker, 'mouseover', function () {
        //     overlay.setMap(map);
        // });

        // // 마커에 mouseout 이벤트를 등록하고 마우스 아웃 시 인포윈도우를 닫습니다
        // window.kakao.maps.event.addListener(marker, 'mouseout', function () {
        //     overlay.setMap(null);
        // });
        
        var overlay = new kakao.maps.CustomOverlay({
            position: position,
            map: null
        });
        
        window.kakao.maps.event.addListener(marker, 'click', async function () {
            if(overlay.getMap() != null ){
                overlay.setMap(null)
                return
            }
 
            var cont = await customOverlay(data, overlay)
            overlay.setContent(cont)
            overlay.setMap(map);
            
            
        });

        return {marker:marker, overlay:overlay}
    }
    useEffect(() => {

        if (!mapContainer) return

        window.kakao?.maps.load(() => {
            setKakao(window.kakao)
            // console.log(mapContainer)
            var options = {
                center: new window.kakao.maps.LatLng(36.508 , 127.957),
                level: 12,
            }
            setMap(new window.kakao.maps.Map(mapContainer, options))
            
            setServices(window.kakao.maps.services)
        
            
        })
    }, [mapContainer])
    // useEffect(() => {
    //     if (!map) return 
    //     // map이 변경되었을 때 원하는 작업 수행
    //     console.log("Map 객체가 변경되었습니다.");
        
    //     // 예: map 객체에 이벤트 리스너 추가
    //     kakao.maps.event.addListener(map, 'dragend', function() {        
    //         console.log("지도 이동이 완료되었습니다.");
    //     });
    // }, [map]);
    return {
        map, putMarker,services,kakao, customOverlay
    }
}


export default useKakaoMap