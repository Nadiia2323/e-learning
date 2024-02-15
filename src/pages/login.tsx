import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import styles from "@/styles/login.module.css";
import { useRouter } from "next/router";
import { UserContext } from "@/hooks/UserContext";

export default function Login() {
  const { fetchUser } = useContext(UserContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [signUp, setSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const toggleLoginClick = () => {
    setSignUp(!signUp);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    console.log("signIn");
    e.preventDefault();
    const siginResponse = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      callbackUrl: `${window.location.origin}`,
      redirect: false,
    });
    if (siginResponse?.ok) {
      fetchUser();
      router.push(`/context`);
      //buid your redirect here
    } else {
      alert("login first");
    }
    // console.log("siginResponse :>> ", siginResponse);
  };
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (credentials.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const urlencoded = new URLSearchParams();
      urlencoded.append("email", credentials.email);
      urlencoded.append("password", credentials.password);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
      };

      const response = await fetch(
        "http://localhost:3000/api/register",
        requestOptions
      );
      const result = await response.json();
      // console.log("result :>> ", result);
      // if (response.ok) {
      //   router.push("/context");
      // } //!rourer doesnt work
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h2>Welcome Back 👋</h2>
          <p>
            Every dream begins with a step forward; every achievement, with the
            courage to start. Dare to dream, dare to act, and watch the
            impossible become your reality
          </p>
          {signUp ? (
            <form onSubmit={handleSignUp}>
              <label htmlFor="email">
                Email
                <input
                  name="email"
                  type="email"
                  placeholder="email"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  name="password"
                  type="password"
                  placeholder="password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="confirmPassword">
                Confirm Password
                <input
                  type="password"
                  placeholder="confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
              <button type="submit">Sign up</button>
            </form>
          ) : (
            <>
              {/* <form
              onSubmit={(e) => {
                handleSignIn(e);
              }}
            > */}
              <label htmlFor="email">
                Email
                <input
                  name="email"
                  type="email"
                  placeholder="email"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  name="password"
                  type="password"
                  placeholder="password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </label>
              <p className={styles.forgotPassword}>Forgot Password?</p>
              {/* <button type="submit">Sign in</button> */}
              <button onClick={handleSignIn}>Sign innn</button>
              <p>or</p>
              {/* <button
                className={styles.googleBtn}
                onClick={() => signIn("google")}
              >
                <img
                  src="https://res.cloudinary.com/dqgvmwnpl/image/upload/v1706279633/E-Learning/7123025_logo_google_g_icon_qc3nm3.png"
                  className={styles.googleIcon}
                />
                Sign in with Google
              </button> */}
              {/* </form> */}
            </>
          )}

          <p onClick={toggleLoginClick}>
            {signUp
              ? "Already have an account? Sign in"
              : "Don't you have an account? Sign up"}
          </p>
        </div>
        <div className={styles.imgContainer}>
          <img
            src="https://res.cloudinary.com/dqgvmwnpl/image/upload/v1706104224/E-Learning/phone-with-music-icon-headphones-blurred-background-music-listening-concept-copy-space_pryqvb.jpg"
            alt=""
          />
        </div>
      </div>
    </>
  );
}
