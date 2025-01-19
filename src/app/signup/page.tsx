"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SignUp() {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
  });

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/users/signup", user);

      console.log("signup success", data);
      localStorage.setItem(
        "signUpSuccess",
        JSON.stringify({ message: "check your email to compleate sign in" })
      );

      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log("SignUp failed", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

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
        onSubmit={onSignUp}
        className="flex flex-col items-center justify-center gap-3 bg-slate-100 w-[20%]! p-3 rounded-lg  sm:w-1/2 lg:w-1/3 w-full"
      >
        <p className="text-black">{loading && "loading..."}</p>
        <h1 className="text-black text-3xl">SignUp</h1>
        <label className="text-black" htmlFor="username">
          username
        </label>
        <input
          id="username"
          className="bg-black rounded-lg p-2"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          type="text"
          placeholder="username"
        />
        <label className="text-black" htmlFor="password">
          password
        </label>
        <input
          id="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="bg-black rounded-lg p-2"
          type="password"
          placeholder="password"
        />
        <label className="text-black" htmlFor="email">
          email
        </label>
        <input
          id="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="bg-black rounded-lg p-2"
          type="email"
          placeholder="email"
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
        <Link className="text-black" href="./login">
          have an account?{" "}
          <span className="text-yellow-600 hover:underline">Login</span>
        </Link>
      </form>
    </div>
  );
}
