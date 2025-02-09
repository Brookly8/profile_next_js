"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [loggedOut, setLoggedOut] = useState(false);
  const router = useRouter();

  const logOut = async () => {
    try {
      await axios("./api/users/logout");
      setLoggedOut(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    router.push("/login");
  }, [loggedOut]);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const { data } = await axios("/api/users/currentuser");
        console.log(data);
        router.push(`/profile/${data.data._id}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          logOut();
          console.log(error.message);
          toast.error(error.message);
        }
      }
    };
    getUserDetails();
  }, []);

  return <div></div>;
}
