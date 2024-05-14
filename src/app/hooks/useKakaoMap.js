import { useEffect, useState } from "react"
import Link from 'next/link';


const useKakaoMap = (mapContainer) => {
    const [map, setMap] = useState(null)
    const [kakao, setKakao] = useState(null)
    const [services, setServices] = useState(null)

    
    const putMarker = (position, data, callbackFn) => {
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

        var overlay = new kakao.maps.CustomOverlay({
            position: position
        });
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
                  
                  
                  <Link className="btn btn-ghost text-lg" href="/">공유해유</Link>
                </div>
              </div>
                  
              </div>
            `
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contDiv;

        const closeBtn = tempDiv.querySelector('.close');
        closeBtn.addEventListener('click', () => { //닫기 이벤트 추가
            overlay.setMap(null);
            callbackFn(data)
        });    
        overlay.setContent(tempDiv)
        // 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 인포윈도우를 표시합니다 
        // window.kakao.maps.event.addListener(marker, 'mouseover', function () {
        //     overlay.setMap(map);
        // });

        // // 마커에 mouseout 이벤트를 등록하고 마우스 아웃 시 인포윈도우를 닫습니다
        // window.kakao.maps.event.addListener(marker, 'mouseout', function () {
        //     overlay.setMap(null);
        // });
 
        window.kakao.maps.event.addListener(marker, 'click', function () {

            overlay.setMap(map);
        });
        return {marker:marker, overlay: overlay}
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
        map, putMarker,services,kakao
    }
}


export default useKakaoMap