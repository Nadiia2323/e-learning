import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react'

export default function SignInButton() {

    const { data: session } = useSession();
    
   

if (session && session.user) {
    return (
        <div>
            <p>{session.user.name}</p>
            <button onClick={() => signOut()}> Sign out</button>
      </div>
  )
}
  return (
    <div>
       <button onClick={() => signIn()}>SignIn</button>
    </div>
   
  )
}
