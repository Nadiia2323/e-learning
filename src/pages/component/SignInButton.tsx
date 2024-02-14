import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, signOut, useSession } from "next-auth/react";

import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import React from "react";

export default function SignInButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div
        style={{
          background: "black",
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "1%",
          paddingTop: "1%",
        }}
      >
        {/* <p>{session.user.name}</p> */}

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title="Sign Out"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "white",
          }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: "24px" }} />
        </button>
      </div>
    );
  }
  return (
    <div
      style={{
        background: "black",

        display: "flex",
        justifyContent: "flex-end",
        paddingRight: "1%",
        paddingTop: "1%",
      }}
    >
      <button
        onClick={() => signIn()}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "white",
        }}
      >
        <FontAwesomeIcon icon={faSignInAlt} style={{ fontSize: "24px" }} />
      </button>
    </div>
  );
}
