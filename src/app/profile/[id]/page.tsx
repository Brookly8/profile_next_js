"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UserProfile({ params }: any) {
  const [userData, setUserData] = useState<any>("");
  const router = useRouter();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const { data } = await axios("/api/users/currentuser");
        setUserData(data.data);
        router.push(`/profile/${data.data._id}`);
      } catch (error) {
        router.push("/login");
      }
    };
    getUserDetails();
  }, []);

  const logOut = async () => {
    try {
      await axios("../api/users/logout");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center  min-h-screen">
      Welcome Back {userData.username}
      <button
        className="bg-purple-400 pl-4 pr-4 pt-2 pb-2 mt-7 rounded-sm hover:bg-purple-300"
        onClick={logOut}
      >
        LogOut
      </button>
    </div>
  );
}
