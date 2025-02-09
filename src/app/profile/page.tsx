"use client";
import React, { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  const logOut = async () => {
    try {
      await axios("./api/users/logout");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        await axios.get("/api/users/currentuser");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            console.warn("Session expired. Redirecting to login...");
            await logOut();
            router.push("/login");
          }
        } else if (error instanceof Error) {
          console.error("Unexpected error:", error.message);
        } else {
          console.error("Unknown error occurred");
        }
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const { data } = await axios("/api/users/currentuser");
        console.log(data);
        router.push(`/profile/${data.data._id}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
          toast.error(error.message);
        }
      }
    };
    getUserDetails();
  }, []);

  return <div></div>;
}
