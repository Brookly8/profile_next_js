"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState("");
  const [newPasswordMessage, setNewPasswordMessage] = useState("");
  const [loginFailed, setLoginFailed] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  useEffect(() => {
    const message = JSON.parse(localStorage.getItem("signUpSuccess")!);
    setSignUpMessage(message?.message);
    const message2 = JSON.parse(
      localStorage.getItem("newPasswordSuccessMessage")!
    );
    setNewPasswordMessage(message2?.message);
  }, []);

  const sumbitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post("/api/users/login", user);

      console.log("signup success", data);
      toast.success("Login success");
      localStorage.setItem("signUpSuccess", JSON.stringify({ message: "" }));
      localStorage.setItem(
        "newPasswordSuccessMessage",
        JSON.stringify({ message: "" })
      );

      router.push("/profile");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log("SignUp failed", error.message);
      }
      setLoginFailed("user with provided email or password not exists");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 items-center justify-center min-h-screen py-2">
      <Link href="/">
        <Image
          className="dark:invert flex"
          src="/next.svg"
          alt="Next.js logo"
          width={360}
          height={76}
          priority
        />
      </Link>
      <form
        onSubmit={sumbitHandler}
        className="flex flex-col items-center justify-center gap-3 bg-slate-100 w-[20%]! p-3 rounded-lg  sm:w-1/2 lg:w-1/3 w-full"
      >
        {loading && <p>loading...</p>}
        <p className="text-black">{signUpMessage && signUpMessage}</p>
        {newPasswordMessage && <p className="text-black">{newPasswordMessage}</p>}
        <h1 className="text-black text-3xl">Login</h1>

        <label className="text-black" htmlFor="email">
          email
        </label>
        <input
          id="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className=" bg-black rounded-lg p-2"
          type="email"
          placeholder="email"
        />
        <label className="text-black" htmlFor="password">
          password
        </label>
        <input
          id="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className=" bg-black rounded-lg p-2"
          type="password"
          placeholder="password"
        />
        <button
          type="submit"
          className={
            buttonDisabled
              ? "border border-black pt-1 pb-1 pr-3 pl-3 rounded-lg text-black"
              : "border border-black pt-1 pb-1 pr-3 pl-3 rounded-lg bg-black"
          }
        >
          Submit
        </button>
        <p className="text-red-800">{loginFailed}</p>
        <div className="text-black">
          Dont have an account?{" "}
          <Link href="./signup" className="text-yellow-600 hover:underline">
            signUp
          </Link>
        </div>
        <div className="text-black">
          Forgot password?{" "}
          <Link
            href="./resetpassword"
            className="text-yellow-600 hover:underline"
          >
            Reset password
          </Link>
        </div>
      </form>
    </div>
  );
}
