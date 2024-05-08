'use client'

import { useEffect, useRef, useState } from "react";
// import './kmap.css'

let map;

function placesSearchCB(data, status, pagination, setLocList) {
    if (status === window.kakao.maps.services.Status.OK) {
        console.log(data);
	

        displayPlaces(data, setLocList);
        console.log(pagination);
    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;
    } else if (status === window.kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
    }
}

function displayPlaces(places, setLocList) {
    var bounds = new window.kakao.maps.LatLngBounds();
    var placeList= [];
    for (var i = 0; i < places.length; i++) {
        var placePosition = new window.kakao.maps.LatLng(places[i].y, places[i].x);
        bounds.extend(placePosition);

		var marker = new window.kakao.maps.Marker({
			map: map,
            position: placePosition // 마커의 위치
        });
		 //마커이름과 주소가 마커위에 생성되게 합니다.
		 var iwContent =   `<div style="padding:8px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">` +
		 `<div style="font-weight: 600; margin-bottom: 3px;">${places[i].place_name}</div>` +
		 `<div>${places[i].address_name}</div>` +
		 `</div>`

		var infowindow = new window.kakao.maps.InfoWindow({
			content : iwContent
		});

		(function(marker, infowindow) {
			// 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 인포윈도우를 표시합니다 
			window.kakao.maps.event.addListener(marker, 'mouseover', function() {
				infowindow.open(map, marker);
			});
	
			// 마커에 mouseout 이벤트를 등록하고 마우스 아웃 시 인포윈도우를 닫습니다
			window.kakao.maps.event.addListener(marker, 'mouseout', function() {
				infowindow.close();
			});
		})(marker, infowindow);
		placeList.push({place: places[i], marker: marker})
    }
    console.log(placeList);
    setLocList(placeList); // 업데이트된 마커 배열을 상태로 설정
    map.setBounds(bounds);
}

export default function Kmap() {
    const searchValue = useRef();
	const [locList, setLocList] = useState([]);

    // useEffect(() => {
    //     var container = document.getElementById('map');
    //     var options = {
    //         center: new window.kakao.maps.LatLng(33.450701, 126.570667),
    //         level: 3
    //     };
    //     map = new window.kakao.maps.Map(container, options); // 전역 map 변수에 할당
    // }, [])
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
    const handleClickSearch= () => {
        console.log(searchValue.current.value);
		//마커 초기화
		for ( var i = 0; i < locList.length; i++ ) {
			locList[i].marker.setMap(null);
		}   
        var ps = new window.kakao.maps.services.Places();  
        ps.keywordSearch(searchValue.current.value, (data, status, pagination) => placesSearchCB(data, status, pagination, setLocList)); 
    }
	const handleSubmit = (event) => {
        event.preventDefault(); // 폼의 기본 동작인 전송을 막음
        handleClickSearch(); // 검색 함수 호출
    }
	const handleClickPlace = (value) => {
		console.log(value)
		var content = '<div style="padding:5px;z-index:1;">' + value.place.place_name + '</div>';
		var infowindow = new window.kakao.maps.InfoWindow({
			content : content
		});
    	infowindow.open(map, value.marker);
	}
    
    return (
        <>
			<div className="absolute bg-white w-96 z-20  h-full shadow-lg">
				<div>
					<label className="input  flex items-center gap-2 focus-within:outline-none focus-within:border-none">
					{/* <input type="text" className="grow " placeholder="장소 검색	" ref={searchValue} /> */}
                    <form onSubmit={handleSubmit}>
                                <input type="text" ref={searchValue} id="keyword" size="15" autoComplete="off" placeholder="장소 검색"/>
                                <button type="submit">검색하기</button>
                    </form>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
					</label>
				</div>
				<ul className="w-full">
					<li>	
						<span>dd</span>
					</li>
				</ul>
			</div>
			<div id="map" style={{ width: '100%', height: '100vh' }}></div>
			
            {/* <div className="map_wrap">
                <div id="map" style={{ width: '100%', height: '100vh' }}></div>

                <div id="menu_wrap" className="bg_white">
                    <div className="option">
                        <div>
                            <form onSubmit={handleSubmit}>
                                키워드 : <input type="text" ref={searchValue} id="keyword" size="15" />
                                <button type="submit">검색하기</button>
                            </form>
                        </div>
                    </div>
                    <hr /> 
				
					<h1 className="text-3xl font-bold underline">
						Hello world!
						</h1>
                    <ul id="placesList">
						{locList.map((value, index) => {
						return (
							<li key={index} onClick={() => {handleClickPlace(value)}}>
								<div>{value.place.place_name}</div>
								<div>{value.place.address_name}</div>
								<hr />
							</li>
							
						);
						})}
					</ul>
                    <div id="pagination"></div>
                </div>
            </div> */}
        </>
    );
}
