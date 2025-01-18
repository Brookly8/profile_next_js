"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {
  const [token, setToken] = useState<string>("");
  const router = useRouter();

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  const submitHandler = () => {
    localStorage.setItem("signUpSuccess", JSON.stringify({ message: "" }));
    router.push("/login");
  };

  useEffect(() => {
    const urlToken: string | null = window.location.search.split("=")[1];
    if (urlToken) {
      setToken(urlToken);
    } else {
      setToken("");
    }
  });

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Your email was successfully confirmed</h1>
      <button
        onClick={submitHandler}
        className="p-4 rounded-sm bg-purple-400 text-black"
      >
        Login
      </button>
    </div>
  );
}
