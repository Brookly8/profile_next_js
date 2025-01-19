"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const sendResetRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data } = await axios.post("/api/users/sendResetPassword", {
        email,
      });
      console.log("Reset link was sanded successfully", data);
      setMessage(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      setErrorMessage("provided email dosnt exists");
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
        onSubmit={sendResetRequest}
        className="flex flex-col items-center justify-center gap-3 bg-slate-100 w-[20%]! p-3 rounded-lg  sm:w-1/2 lg:w-1/3 w-full"
      >
        {loading && <p>Loading...</p>}
        <span className="text-black">Enter your email</span>
        <input
          className="bg-black rounded-md pl-2 pr-2 pt-1 pb-1"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <button
          className="border border-black pt-1 pb-1 pr-3 pl-3 rounded-lg text-black"
          type="submit"
        >
          Submit
        </button>
        {message && (
          <span className="text-black">
            check your email and click reset passsword link to create new
            password
          </span>
        )}
        <div>
          <span className="text-black">go to </span>
          <Link className="text-yellow-600" href="/login">login</Link>
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </div>
  );
}
