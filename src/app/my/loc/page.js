'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import Header from "@/app/components/layout/header";
import '@/app/components/kmap.css'
import Axios from "@/util/axios";
import useKakaoMap from "@/app/hooks/useKakaoMap";
import useCustomLogin from '@/app/hooks/useCustomLogin'
import LocEditTag from '@/app/components/modal/locEditTag'
import Link from 'next/link';


export default function Kmap() {
  const router = useRouter();  
  const searchValue = useRef();
  const addListInputValue = useRef()

  const [locList, setLocList] = useState([]); //찜 목록
  const [tagList, setTagList] = useState([]); //유저 리스트 목록
  const [userLocList, setUserLocList] = useState([]) //유저 찜목록 id배열
  const [modal, setModal] = useState(null)
  const [selectLoc, setSelectLoc] = useState(null)
  const { isLogin,getUser } = useCustomLogin();

  const [container, setContainer ] = useState(null)
  const {map, putMarker, kakao} = useKakaoMap(container)

  const [visibleTag, setVisibleTag] = useState(null);
  

  useEffect(() => {
      (async function () {
          const res = await Axios.get(`/api/v1/loc`)
          
          setUserLocList(res.data.list)
          const res2 = await Axios.get(`/api/v1/loc/list/`)
          
          setTagList(res2.data)

      })();
  },[])
  useEffect(() => {
      (async function () {
          const res = await Axios.get(`/api/v1/loc`)
          setMarkers(res.data.loc)
          // setLocList(res.data.loc)
      })();
  },[userLocList, kakao])

  
  const callbackFN = (value) => {
    console.log(value)
    setSelectLoc(null)
  }

  const setMarkers = (places) => {
  
      if(!kakao) return
      
      const bounds = new kakao.maps.LatLngBounds()
      let markers = []
      for (var i = 0; i < places.length; i++) {

          var position = new kakao.maps.LatLng(places[i].y, places[i].x)
      
          var {marker, overlay} = putMarker(position, places[i],callbackFN)
          bounds.extend(new kakao.maps.LatLng(places[i].y, places[i].x))
          markers.push({place: places[i], marker: marker, overlay:overlay})
      }
      
      setLocList(markers)
      map.setBounds(bounds)
  }
  const setMarkersbyTag = (tag) => {
    const bounds = new kakao.maps.LatLngBounds()
    locList.forEach(value => {
       value.marker.setMap(null)
        if (!tag || value.place.tag.includes(tag)) {
            value.marker.setMap(map)
            bounds.extend(value.marker.getPosition())
        }
    });
    map.setBounds(bounds)
  }
 

  const handleClickPlace = (value) => {
      console.log(value.marker)
      for (var i = 0; i < locList.length; i++) {
          locList[i].overlay.setMap(null);
      }
      map.panTo(value.marker.getPosition()); 
      value.overlay.setMap(map);
      setSelectLoc(value.place)
  }
  const handleClickLocTag = async (place) => {
    setModal({id: place.id, place:place})
  }
  const handleClickAddList = async () => {
    
    console.log(addListInputValue.current.value)
    var value = addListInputValue.current.value;
    if(value.trim() == '') {
      alert("리스트명을 입력해주세요")
      return
    }
    try {
      const res = await Axios.post(`/api/v1/loc/list/`, {name:value})
      setTagList(res.data)
      console.log(res)
      
    } catch ({response}) {
      alert(response.data.error)
    }
    addListInputValue.current.value = null;
    
    
   
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
  const handleClickLocTagEnd = async (place, value) => {
    setModal(null)
    if(!place) return
    const res = await Axios.patch(`/api/v1/loc/${place.id}`, {value: value})
    locList.map((val) => {
      if(val.place.id == place.id) {
        val.place.tag = value
      } 
    })
    setUserLocList([...userLocList])
    alert("리스트에 적용되었습니다")
    
  }
  const handleClickTag = async (tag) => {

    // setMarkers(res.data.loc)
    setMarkersbyTag(tag)
    setVisibleTag(tag)
  }
  
  const editTag = async (value,e) => { //리스트 이름 수정
    console.log(value)
    const tag = e.target.previousSibling.value

    try {
      const res = await Axios.patch(`/api/v1/loc/list/${value}`, {value:tag})
      setTagList(res.data)
      setUserLocList([...userLocList])
      alert("수정되었습니다")
      
    } catch ({response}) {
      alert(response.data.error)
    }
  }
  const dropTag = async (value) => { //리스트 삭제
    console.log(value)

    try {
      const res = await Axios.delete(`/api/v1/loc/list/${value}`)
      setTagList(res.data)
      setUserLocList([...userLocList])
      alert("삭제되었습니다")
      
    } catch ({response}) {
      alert(response.data.error)
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼의 기본 동작인 전송을 막음
    router.push(`/?search=${searchValue.current.value}`)
  }

  return (

    <>
      <Header  searchValue={searchValue} handleSubmit={handleSubmit}  />
      {modal && (
        <LocEditTag place={modal.place} list={tagList} callbackFn={handleClickLocTagEnd} />
      )}
      {/* {selectLoc && (
        <>
          <div className='absolute z-50 m-2'>
            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{selectLoc.place_name}</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div className="card-actions justify-end">
                  <Link href={`/loc/${selectLoc.id}/post`} className="btn btn-primary">추억 담기</Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )} */}
      
      <hr/>
      <div className="flex ">
      <div style={{ width: 'calc(100vw - 400px)', height: 'calc(100vh - 66px)' }} ref={setContainer}></div>

        <div className="flex-1 overflow-auto" style={{ height: "calc(100vh - 66px)" }}>
          <div className="p-2"> 
            <div className="font-semibold">
              전체 리스트
            </div>
            <div className=" pb-2">
              <div className="badge badge-md badge-ghost"  onClick={()=> {document.getElementById('my_modal_1').showModal()}}>+ 새 리스트 만들기</div>
            </div>
            <div className={`${visibleTag ? '' : 'hidden'} pb-2 `}>
            <div className="badge badge-md badge-neutral cursor-pointer" onClick={() => {setVisibleTag(null); setMarkersbyTag()}}>전체 보기</div>
          </div>
            
            <hr/>
            {tagList.length > 0 && tagList.map((value,index) => {
              return (
                <div  key={index}>
                  <div className="bg-base-200 p-2 flex justify-between border-b-2 items-center">
                    <div className="font-semibold">
                      <span className="cursor-pointer"onClick={() => {handleClickTag(value)}}>{value}</span><div className=" ml-2 badge badge-neutral">{locList.reduce((acc, item) => acc + (item.place.tag.includes(value) ? 1 : 0), 0)}</div>
                    </div>
                    <div>
                      <span className="text-sm btn btn-sm btn-ghost bg-base-300" onClick={()=> {document.getElementById(`modal-${value}`).showModal()}}>편집</span>
                    </div>

                    <dialog id={`modal-${value}`} className="modal">
                    <div className="modal-box max-w-sm">
                        <h3 className="font-bold text-lg mb-2">#{value}</h3>
                        <div className="label">
                          <span className="label-text">리스트 이름 수정</span>
                        </div>
                        <div className="join">
                        <input className="input input-bordered join-item" placeholder={value}/>
                        <button className="btn join-item" onClick={(event) => {editTag(value,event)}}>수정</button>
                      </div>
                        <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-error mr-2" onClick={() => dropTag(value)} >삭제</button>
                            <button className="btn" name="time" >닫기</button>
                        </form>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                    </dialog>

                  </div>
              </div>
              )
            })}
            
          </div>
          <div className="p-2">
            <div className="font-semibold">
              {visibleTag ? (<>#{visibleTag} </>) : (<>전체 장소 {userLocList.length}</>)}
              
            </div>
            <hr/>
            <div className="w-full">
            {locList.map((value,index) => {
                if (visibleTag && !value.place.tag.includes(visibleTag)) return null;
                return (
                  
                <div key={index} className="py-2 border-b-2">
                    <div className="flex items-center cursor-pointer"  onClick={() => { handleClickPlace(value) }}>
                        <span className="font-bold   whitespace-nowrap">{value.place.place_name} </span>
                        <div className="pl-1 text-sm text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis ">{value.place.address_name}</div>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-sm text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis w-56">{value.place.category_name}</p>
                        <div>
                          <div className="badge badge-md badge-neutral " onClick={() => { handleClickLocTag(value.place) }}>+리스트</div>
                          <div className={`badge badge-md bg-red-400 text-white`} onClick={() => { handleClickHeart(value.place) }}>저장❤️</div>
                        </div>
                    </div>
                    <div>
                    {value.place.tag.map((value,index) => {
                    return (
                      <div className="badge badge-md badge-outline bg-base-100 mr-1" key={index}>#{value}</div>
                    )
                    })}
                      
                    </div>  

                </div>
                
                )
            })}
            </div>
          </div>
        </div>
      </div>
      {/* 시간 모달 */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg mb-2">리스트 추가</h3>
            <input ref={addListInputValue} type="text" placeholder="리스트명을 입력하시오" className="input input-bordered w-full max-w-xs" />
            <div className="modal-action">
            <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-neutral mr-2" onClick={handleClickAddList} >추가</button>
                <button className="btn" name="time" >취소</button>
            </form>
            </div>
        </div>
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
        </dialog>
    </>
  );
}


