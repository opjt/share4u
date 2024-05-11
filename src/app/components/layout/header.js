import Image from 'next/image'
import { signIn, signOut } from "next-auth/react"
import useCustomLogin from '@/app/hooks/useCustomLogin'
import Link from 'next/link';

export default function Header({ handleSubmit, searchValue, setViewMode }) {
    const { isLogin, getUser,doLogin } = useCustomLogin();
    // console.log(isLogin)
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link className="btn btn-ghost text-lg" href="/">공유해유</Link>
            </div>
            <div className="flex-none gap-2">
                {isLogin && (
                    <div className='flex gap-2 mr-2 font-medium'>
                        <h1 className='btn btn-sm' onClick={() => setViewMode("장소")}>내 장소</h1>
                        <h1 className='btn btn-sm' onClick={() => setViewMode("리스트")}>내 리스트</h1>
                    </div>
                )}

                <div className="form-control relative">
                    <form onSubmit={handleSubmit}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-2 right-2" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#7b7b7b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="장소 검색" ref={searchValue} className="input input-bordered w-24 md:w-auto h-10" />
                    </form>
                </div>
                {isLogin ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="flex justify-center items-center gap-2 border-[1px] border-gray-300 rounded-box p-2 px-3 btn-ghost">
                            <Image className="w-6 h-6" src={`/img/image.png`} alt="usericon" width="60" height="60" />

                            <div className="text-stone-800 text-xs font-bold">{getUser.name}</div>

                        </div>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li><a onClick={() => setViewMode(1)}>로그아웃</a></li>
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
        </div>
    )
}