"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState("");
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
  }, []);

  const sumbitHandler = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post("/api/users/login", user);

      console.log("signup success", data);
      toast.success("Login success");
      localStorage.setItem("signUpSuccess", JSON.stringify({ message: "" }));

      router.push("/profile");
    } catch (error: any) {
      toast.error(error.message);
      setLoginFailed("user with provided email or password not exists");
      console.log("SignUp failed", error.message);
    } finally {
      setLoading(false);
    }
  };
  console.log(signUpMessage);

  return (
    <div className="flex items-center justify-center min-h-screen py-2">
      <form
        onSubmit={sumbitHandler}
        className="flex flex-col items-center justify-center gap-3 bg-purple-400 w-[20%]! p-3 rounded-lg  sm:w-1/2 lg:w-1/3 w-full"
      >
          {loading && <p>"loading..."</p>}
        <p>
          {signUpMessage && signUpMessage}
        </p>
        <h1 className="text-black text-3xl">Login</h1>

        <label className="text-black" htmlFor="email">
          email
        </label>
        <input
          id="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="text-black rounded-lg p-2"
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
          className="text-black rounded-lg p-2"
          type="password"
          placeholder="password"
        />
        <button
          type="submit"
          className={
            buttonDisabled
              ? "bg-purple-300 pt-1 pb-1 pr-3 pl-3 rounded-lg text-white"
              : "bg-purple-600 pt-1 pb-1 pr-3 pl-3 hover:bg-purple-500 rounded-lg text-white"
          }
        >
          Submit
        </button>
        <p className="text-red-800">{loginFailed}</p>
        <Link className="text-black" href="./signup">
          Don't have an account?{" "}
          <span className="text-purple-200 hover:underline">signUp</span>
        </Link>
      </form>
    </div>
  );
}
