import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from "next-auth/react"
import useCustomLogin from '@/app/hooks/useCustomLogin'
import { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import Axios from '@/util/axios';

export default function Header({ handleSubmit = null , searchValue = null}) {
    
    const searchRef = useRef()
    const router = useRouter();  
    const nickRef = useRef()
    const [checkNick, setChecknick] = useState(false)

    const { isLogin, getUser,doLogin,doUpdate } = useCustomLogin();
    const searchInput = searchValue || searchRef;

    const defaultSubmit = (e) => {
        e.preventDefault();
        router.push(`/?search=${searchInput.current.value}`)
    }
    const handleClickModify = async (e) => {
        e.preventDefault(); // 폼의 기본 동작인 전송을 막음
        if(!checkNick) {
            alert("중복체크를 해주세요")
            return
        }
        try {
            var value = nickRef.current.value
            nickRef.current.value = null
            var res = await Axios.put(`/api/v1/nickname`,{value:value})
            doUpdate({nickname:value})
            console.log(res)
            alert("수정되었습니다")
            
          } catch ({response}) {
            alert(response.data.error)
          }
    }
    const handleChange = () => {
        setChecknick(false)
    }
    const handleClickCheck = async () => {
        console.log("3?")
        try {
            var res = await Axios.get(`/api/v1/nickname?value=${nickRef.current.value}`)
            setChecknick(true)
            
          } catch ({response}) {
            alert(response.data.error)
          }
    }
    // console.log(isLogin)
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link className="btn btn-ghost text-lg" href="/">공유해유</Link>
            </div>
            <div className="flex-none gap-2">
                {isLogin && (
                    <div className='flex gap-2 mr-2 font-medium'>
                        <Link href="/my/loc" className='btn btn-sm'>내 장소</Link>
                        <Link href="/my/post" className='btn btn-sm'>내 추억</Link>
                        
                    </div>
                )}

                <div className="form-control relative">
                    <form onSubmit={handleSubmit || defaultSubmit}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-2 right-2" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#7b7b7b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="장소 검색" ref={searchInput} className="input input-bordered w-24 md:w-auto h-10" />
                    </form>
                </div>
                {isLogin ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="flex justify-center items-center gap-2 border-[1px] border-gray-300 rounded-box p-2 px-3 btn-ghost">
                            <Image className="w-6 h-6" src={`/img/image.png`} alt="usericon" width="60" height="60" />

                            <div className="text-stone-800 text-xs font-bold">{getUser.nickname}</div>

                        </div>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li><a onClick={()=> {document.getElementById('modal_header').showModal(); setChecknick(false); nickRef.current.value=""}}>내 정보</a></li>
                            <li><a onClick={() => signOut()}>Logout</a></li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex justify-center items-center gap-2 border-[1px] border-gray-300 rounded-box p-2 px-3 btn-ghost" onClick={() => doLogin()}>
                        <Image className="w-6 h-6" src={`/img/image.png`} alt="usericon" width="60" height="60" />
                        <div className="text-stone-800 text-xs font-bold">로그인 및 회원가입</div>
                    </div>
                )}

            </div>

            <dialog id="modal_header" className="modal">
                <div className="modal-box max-w-[600px]">
                    <h3 className="font-bold  mb-2">내 정보</h3>
                    
                    <label className='label label-text'>이메일</label>
                    <input type="text" placeholder={getUser?.email} class="input input-bordered w-full max-w-[360px]" disabled />

                    <label className='label label-text'>닉네임</label>
                    <input type="text" placeholder={getUser?.nickname} class="input input-bordered w-full max-w-[360px]"
                     onChange={handleChange} ref={nickRef} />
                    <div className={`btn ml-3 ${checkNick && 'btn-disabled'}`} onClick={handleClickCheck}>중복검사</div>

                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-neutral mr-2" onClick={handleClickModify} >수정</button>
                            <button className="btn" name="time" >취소</button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}