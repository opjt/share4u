
import { useEffect,useState } from "react"

const useKakaoMap = (mapContainer) => {
    const [map,setMap] = useState(null)
    const [kakao, setKakao] = useState(null)
    const [services, setServices] = useState(null)

    const putMarker = (position) => {
        var marker = new kakao.maps.Marker({
            map: map,
            position: position // 마커의 위치
        });
    }
    useEffect(() => {
        if(!mapContainer) return

        window.kakao?.maps.load(() => {
            console.log(mapContainer)
            var options = {
                center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                level: 3,
            }
            setMap(new window.kakao.maps.Map(mapContainer, options))
            setKakao(window.kakao)
            setServices(window.kakao.maps.services)
        })
    }, [mapContainer])
    return {
        map, putMarker
    }
}


export default useKakaoMap