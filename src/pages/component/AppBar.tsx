import { headers } from "next/headers";
import React from "react";
import SignInButton from "./SignInButton";
import { useSession } from "next-auth/react";

export default function AppBar() {
  const { data } = useSession();
  //?for gettin token from session//
  // const accessToken = data?.accessToken ?? null;
  // console.log('accessToken :>> ', accessToken);

  return (
    <header style={{ background: "black" }}>
      {/* <h4 style={{ color: "white" }}>
        Rhythms of Learning: Where Music Meets English Mastery!
      </h4> */}
      <SignInButton />
    </header>
  );
}
