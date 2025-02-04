"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UserProfile() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [userData, setUserData] = useState({
    username: "",
  });
  const [allJobs, setAllJobs] = useState([]);
  const [job, setJob] = useState<{
    title: string;
    salary: string;
    type: string;
    date: Date | null;
  }>({
    title: "",
    salary: "",
    type: "",
    date: new Date(),
  });
  const [inputField, setInputField] = useState(false);
  const [filtering, setFiltering] = useState(false);

  const getJobsDetails = async () => {
    try {
      const { data } = await axios("/api/users/alljobs");
      setAllJobs(data.jobs);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }
    setFiltering(false);
    setInput("");
  };

  const search = async () => {
    const filteredJobs = allJobs.filter((job: { title: string }) =>
      job.title.includes(input)
    );
    setAllJobs(filteredJobs);
    setFiltering((prev) => !prev);
  };

  const addJob = async () => {
    try {
      const localDate = new Date();
      const adjustedDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
      );

      const newJob = { ...job, date: adjustedDate };
      const { data } = await axios.post("/api/users/job", newJob);

      console.log("signup success", data);
      setJob({ title: "", salary: "", type: "", date: null });

      setInputField((prev) => !prev);
      getJobsDetails();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const { data } = await axios("/api/users/currentuser");
        setUserData(data.data);
        router.push(`/profile/${data.data._id}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
          toast.error(error.message);
        }

        router.push("/login");
      }
    };

    getJobsDetails();
    getUserDetails();
  }, []);

  const logOut = async () => {
    try {
      await axios("../api/users/logout");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex bg-slate-800 p-4 rounded-lg mb-5 items-center">
        <div className="flex gap-4 items-center w-[100%] justify-between">
          <p>
            Welcome Back{" "}
            <span className="bg-orange-400 pt-2 pb-2 pr-3 pl-3 rounded-lg text-black">
              {userData.username}
            </span>
          </p>
          <button
            onClick={() => setInputField((prev) => !prev)}
            className="border bg-white border-white pt-1 pb-1 pr-3 pl-3 rounded-lg text-black"
          >
            Add Job
          </button>
          <div className="flex gap-8">
            <button
              onClick={search}
              className="border bg-white border-white pt-1 pb-1 pr-3 pl-3 rounded-lg text-black"
            >
              Search
            </button>
            <input
              onChange={(e) => setInput(e.target.value)}
              placeholder="Title/Company Name"
              type="text"
              value={input}
              className="p-2 text-black"
            />
            <button
              onClick={getJobsDetails}
              className={`text-2xl ${filtering ? "flex" : "hidden"}`}
            >
              ❌
            </button>
          </div>
          <button
            className="border bg-white border-white pt-1 pb-1 pr-3 pl-3 rounded-lg text-black"
            onClick={logOut}
          >
            LogOut
          </button>
        </div>
      </div>
      <div
        className={`bg-slate-300 rounded-md flex-col p-4 gap-8 ${
          inputField ? "flex absolute w-[60%] left-[20%] top-[30%]" : "hidden"
        }`}
      >
        <div className="flex flex-col items-center">
          <span className="text-black">Job Title:</span>
          <input
            onChange={(e) => setJob({ ...job, title: e.target.value })}
            className="text-black rounded-md w-[60%]"
            type="text"
            value={job.title}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-black">Salary:</span>
          <input
            onChange={(e) => setJob({ ...job, salary: e.target.value })}
            className="text-black rounded-md w-[60%]"
            type="text"
            value={job.salary}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-black">Type:</span>
          <input
            onChange={(e) => setJob({ ...job, type: e.target.value })}
            className="text-black rounded-md w-[60%]"
            type="text"
            value={job.type}
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={addJob}
            className=" bg-black border-white pt-1 pb-1 pr-3 pl-3 rounded-lg text-white w-[20%]"
          >
            Submit
          </button>
        </div>
      </div>
      <div className="flex justify-around gap-2 mb-5 mt-5">
        <div className=" w-[30%] flex justify-center text-xl">
          Title/Company Name
        </div>
        <div className=" w-[30%] flex justify-center text-xl">Salary</div>
        <div className=" w-[30%] flex justify-center text-xl">Type</div>
        <div className=" w-[30%] flex justify-center text-xl">Time</div>
      </div>

      {allJobs.map(
        (
          job: { title: string; salary: string; type: string; date: Date },
          index
        ) => {
          return (
            <div key={index} className="flex justify-around gap-2 mb-3">
              <div className="bg-white p-1 text-black flex justify-center items-center w-[30%] rounded-md">
                {job.title}
              </div>
              <div className="bg-white p-1 text-black flex justify-center items-center w-[30%] rounded-md">
                {job.salary}
              </div>
              <div className="bg-white p-1 text-black flex justify-center items-center w-[30%] rounded-md">
                {job.type}
              </div>
              <div className="bg-white p-1 text-black flex justify-center items-center w-[30%] rounded-md">
                {`${job.date.toString().slice(0, 8)} `}
                <span className="font-bold underline">
                  {job.date.toString().slice(8, 10)}
                </span>
                {`--`}
                {`${job.date.toString().slice(11, 19)}`}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}
