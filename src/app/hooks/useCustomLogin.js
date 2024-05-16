import Axios from "@/util/axios"
import { useSession } from "next-auth/react"
import { signIn, signOut } from "next-auth/react"

const useCustomLogin = () => {
    const { data: session, status,update } = useSession()
    const isLogin = session //----------로그인 여부

    const getUser = session?.user // 유저 정보 

    const doLogin = async () => {
        const result = await signIn('kakao');
        if (result?.error) {
            console.error('Failed to sign in:', result.error);
            return;
        }
        // 로그인 성공 후 API 호출
    }
    const doUpdate = (value) => {
        update({nickname:value})
    }
    const getUserLoc = async () => {
        const res = await Axios.get(`/api/v1/loc`)
        return res.data.list
    }

  
    return {
        isLogin,getUser, doLogin,doUpdate,getUserLoc
    }
}


export default useCustomLogin