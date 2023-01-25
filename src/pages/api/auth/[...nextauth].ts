import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import firebase from "../../../services/firebaseConnection";

export default NextAuth({

  secret: process.env.NEXTAUTH_SECRET,
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

        const lastDonate = await firebase.firestore().collection('users')
          .doc(String(token.sub))
          .get()
          .then((snapshot) => {
            if(snapshot.exists){
              return snapshot.data()?.lastDonate.toDate();
            }else{
              return null;
            }
          })

        return{
          ...session,
          id: token.sub,
          vip: lastDonate ? true : false,
          lastDonate: lastDonate
        }
      }catch(err){
        
        return{
          ...session,
          id: null,
          vip: false,
          lastDonate: null
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