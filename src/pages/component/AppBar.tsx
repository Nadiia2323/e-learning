import { headers } from 'next/headers'
import React from 'react'
import SignInButton from './SignInButton'
import { useSession } from 'next-auth/react'

export default function AppBar() {
    const { data } = useSession()
    //?for gettin token from session//
    // const accessToken = data?.accessToken ?? null;
    // console.log('accessToken :>> ', accessToken);

  return (
      <header>
          <SignInButton/>
  </header>
  )
}
