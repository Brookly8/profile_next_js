"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function NewPasswordPage() {
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

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
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
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setMessage(true);
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
        onSubmit={changePassword}
        className="flex flex-col items-center justify-center gap-3 bg-slate-100 w-[20%]! p-3 rounded-lg  sm:w-1/2 lg:w-1/3 w-full"
      >
        {loading && <p>Loading...</p>}
        <span className="text-black">create new password</span>
        <input
          className="bg-black rounded-md pl-2 pr-2 pt-1 pb-1"
          onChange={(e) =>
            setNewPassword({ ...newPassword, password: e.target.value })
          }
          type="password"
          placeholder="password"
        />
        <input
          className="bg-black rounded-md pl-2 pr-2 pt-1 pb-1"
          onChange={(e) =>
            setNewPassword({ ...newPassword, password2: e.target.value })
          }
          type="password"
          placeholder="repeat password"
        />
        <button
          className="border border-black pt-1 pb-1 pr-3 pl-3 rounded-lg text-black"
          type="submit"
        >
          Submit
        </button>
        {message && <p>passwords not simular please try again</p>}
      </form>
    </div>
  );
}
