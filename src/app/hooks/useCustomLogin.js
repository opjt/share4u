import { useSession } from "next-auth/react"
import { signIn, signOut } from "next-auth/react"

const useCustomLogin = () => {
    const { data: session, status } = useSession()
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

  
    return {
        isLogin,getUser, doLogin
    }
}


export default useCustomLogin