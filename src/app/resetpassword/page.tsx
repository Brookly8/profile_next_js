"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";

export default function resetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const sendResetRequest = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data } = await axios.post("/api/users/sendResetPassword", {
        email,
      });
      console.log("Reset link was sanded successfully", data);
      setMessage(true);
    } catch (error: any) {
      setErrorMessage("provided email dosnt exists");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-2">
      <form
        onSubmit={sendResetRequest}
        className="flex flex-col items-center justify-center gap-3 bg-purple-400 w-[20%]! p-3 rounded-lg  sm:w-1/2 lg:w-1/3 w-full"
      >
        {loading && <p>Loading...</p>}
        <span className="text-black">Enter your email</span>
        <input
          className="text-black rounded-md pl-2 pr-2 pt-1 pb-1"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <button
          className="bg-purple-600 rounded-md pl-2 pr-2 pt-1 pb-1"
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
          <Link href="/login">login</Link>
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </div>
  );
}
