import NextAuth from 'next-auth'
import KakaoProvider from 'next-auth/providers/kakao'

export default NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) { 
      if (account) {
        token.accessToken = account.access_token 
        token.id = profile.id
      }
      return token 
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken // 전달받은 token 객체에서 토큰 값을 다시 session 객체에 담고
      session.user.id = token.id
      
      return session // 반환해주면, client에서 접근 가능하다. 
    }
  }
})