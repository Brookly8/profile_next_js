"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function page() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState({
    password: "",
    password2: "",
  });
  const router = useRouter();

  useEffect(() => {
    const urlToken: string | null = window.location.search.split("=")[1];
    if (urlToken) {
      setToken(urlToken);
    } else {
      setToken("");
    }
  }, []);

  const changePassword = async (e: any) => {
    e.preventDefault();
    if (newPassword.password === newPassword.password2 && token.length > 0) {
      try {
        setLoading(true);
        await axios.post("/api/users/createnewpassword", {
          token,
          password: newPassword.password,
        });
        localStorage.setItem(
          "newPasswordSuccessMessage",
          JSON.stringify({ message: "your password successfully changed" })
        );
        router.push("/login");
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setMessage(true);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen py-2">
      <form
        onSubmit={changePassword}
        className="flex flex-col items-center justify-center gap-3 bg-purple-400 w-[20%]! p-3 rounded-lg  sm:w-1/2 lg:w-1/3 w-full"
      >
        {loading && <p>Loading...</p>}
        <span className="text-black">create new password</span>
        <input
          className="text-black rounded-md pl-2 pr-2 pt-1 pb-1"
          onChange={(e) =>
            setNewPassword({ ...newPassword, password: e.target.value })
          }
          type="password"
          placeholder="password"
        />
        <input
          className="text-black rounded-md pl-2 pr-2 pt-1 pb-1"
          onChange={(e) =>
            setNewPassword({ ...newPassword, password2: e.target.value })
          }
          type="password"
          placeholder="repeat password"
        />
        <button
          className="bg-purple-600 rounded-md pl-2 pr-2 pt-1 pb-1"
          type="submit"
        >
          Submit
        </button>
        {message && <p>passwords not simular please try again</p>}
      </form>
    </div>
  );
}
