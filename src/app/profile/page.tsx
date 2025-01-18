"use client";
import React, { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const { data } = await axios("/api/users/currentuser");
        console.log(data);
        router.push(`/profile/${data.data._id}`);
      } catch (error: any) {
        console.log(error.message);
        logOut();
      }
    };
    getUserDetails();
  }, []);

  const logOut = async () => {
    try {
      await axios("./api/users/logout");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center  min-h-screen">
      Profile
      <button
        className="bg-purple-400 pl-4 pr-4 pt-2 pb-2 mt-7 rounded-sm hover:bg-purple-300"
        onClick={logOut}
      >
        LogOut
      </button>
    </div>
  );
}
