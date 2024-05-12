import { useEffect, useState } from "react"

function makeDiv(overlay, data) {
    var content = document.createElement('div');
    content.className = 'wrap';
    var info = document.createElement('div');
    info.className = 'info';

    var title = document.createElement('div');
    title.className = 'title';
    title.textContent = data?.place_name;

    var closeBtn = document.createElement('div');
    closeBtn.className = 'close';
    closeBtn.title = '닫기';
    closeBtn.onclick = function() {
        overlay.setMap(null)
    };

    title.appendChild(closeBtn);
    info.appendChild(title);

    var desc = document.createElement('div');
    desc.className = 'desc';

    var jibun1 = document.createElement('div');
    jibun1.className = 'jibun ellipsis';
    jibun1.textContent = data?.address_name;

    var jibun2 = document.createElement('div');
    jibun2.className = 'jibun ellipsis';
    jibun2.textContent = '(우) 63309 (지번) 영평동 2181';

    desc.appendChild(jibun1);
    desc.appendChild(jibun2);
    info.appendChild(desc);

    content.appendChild(info);

    return content;
}


const useKakaoMap = (mapContainer) => {
    const [map, setMap] = useState(null)
    const [kakao, setKakao] = useState(null)
    const [services, setServices] = useState(null)

    
    const putMarker = (position, data) => {
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
        var content = makeDiv(overlay,data)
        
        overlay.setContent(content)
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
                center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                level: 3,
            }
            setMap(new window.kakao.maps.Map(mapContainer, options))
            
            setServices(window.kakao.maps.services)
    
            
        })
    }, [mapContainer])
    return {
        map, putMarker,services,kakao
    }
}


export default useKakaoMap