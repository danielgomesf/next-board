import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export default NextAuth({

  providers: [
    GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        // @ts-ignore
        scope: 'read:user'
    }),
  ],
  callbacks: {
    // @ts-ignore
    async session({session , profile, token }) {


      try{
        return{
          ...session,
          id: token.sub
        }
      }catch(err){
        
        return{
          ...session,
          id: null
        }
      }

    },
    // @ts-ignore
    async signIn({user , account , profile }){
      const { email } = user;

      try{
        return true
      }catch(err){
        console.log('Erro:',err);
        return false
      }
      
    }
  }
})