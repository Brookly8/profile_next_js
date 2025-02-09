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
  const [allJobs, setAllJobs] = useState<
    { title: string; salary: string; type: string; date: Date | null }[]
  >([]);
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

      const formattedJobs = data.jobs.map((job: any) => ({
        ...job,
        date: job.date ? new Date(job.date) : null, // Ensure valid Date object
      }));

      setAllJobs(formattedJobs.reverse());
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      }
    }
    setFiltering(false);
    setInput("");
  };

  const countForDay = (day: string) => {
    const res = allJobs.filter(
      (job) => job.date && job.date.toISOString().slice(8, 10) === day
    );
    return res.length;
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
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row bg-slate-800 p-4 rounded-lg mb-5 items-center justify-between">
        <p className="hidden text-center md:text-left md:block">
          Welcome Back{" "}
          <span className="bg-orange-400 p-2 rounded-lg text-black">
            {userData.username}
          </span>
        </p>
        <div className="flex flex-wrap gap-4 justify-center md:justify-end w-full md:w-auto">
          <button
            onClick={() => setInputField((prev) => !prev)}
            className="border bg-white border-white py-2 px-4 rounded-lg text-black"
          >
            Add Job
          </button>
          <button
            onClick={search}
            className="border bg-white border-white py-2 px-4 rounded-lg text-black"
          >
            Search
          </button>
          <input
            onChange={(e) => setInput(e.target.value)}
            placeholder="Title/Company Name"
            type="text"
            value={input}
            className="p-2 text-black w-full md:w-auto"
          />
          <button
            onClick={getJobsDetails}
            className={`text-2xl ${
              filtering ? "flex justify-center items-center" : "hidden"
            }`}
          >
            ❌
          </button>
          <button
            className="border bg-white border-white py-2 px-4 rounded-lg text-black"
            onClick={logOut}
          >
            LogOut
          </button>
        </div>
      </div>

      {/* Job Form */}
      <div
        className={`bg-slate-300 rounded-md flex-col p-4 gap-4 ${
          inputField
            ? "flex absolute w-[90%] md:w-[60%] left-[5%] md:left-[20%] top-[30%]"
            : "hidden"
        }`}
      >
        <div className="flex flex-col items-center">
          <span className="text-black">Job Title:</span>
          <input
            onChange={(e) => setJob({ ...job, title: e.target.value })}
            className="text-black rounded-md w-[90%] md:w-[60%] p-2"
            type="text"
            value={job.title}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-black">Salary:</span>
          <input
            onChange={(e) => setJob({ ...job, salary: e.target.value })}
            className="text-black rounded-md w-[90%] md:w-[60%] p-2"
            type="text"
            value={job.salary}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-black">Type:</span>
          <input
            onChange={(e) => setJob({ ...job, type: e.target.value })}
            className="text-black rounded-md w-[90%] md:w-[60%] p-2"
            type="text"
            value={job.type}
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={addJob}
            className="bg-black border-white py-2 px-4 rounded-lg text-white w-[50%] md:w-[20%]"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Job Table Header */}
      <div className="hidden md:flex justify-around gap-2 mb-5 mt-5">
        <div className="w-[30%] flex justify-center text-xl">
          Title/Company Name
        </div>
        <div className="w-[30%] flex justify-center text-xl">Salary</div>
        <div className="w-[30%] flex justify-center text-xl">Type</div>
        <div className="w-[30%] flex justify-center text-xl">Time</div>
      </div>

      {/* Job List */}
      {allJobs.map((job, index) => {
        return (
          <div key={index} className="border-b py-4">
            {/* Date & Total Count */}
            {job.date &&
              job.date.toISOString().slice(0, 10) !==
                allJobs[index - 1]?.date?.toISOString().slice(0, 10) && (
                <div className="font-bold underline mb-2 text-lg text-center md:text-left">
                  {job.date.toISOString().slice(0, 10)}
                  <p className="text-sm">
                    Total Applications:{" "}
                    <span className="font-bold">
                      {countForDay(job.date.toISOString().slice(8, 10))}
                    </span>
                  </p>
                </div>
              )}

            {/* Job Details */}
            <div className="flex flex-col md:flex-row justify-around gap-2 mb-3 p-2 bg-white rounded-md">
              <div className="p-2 text-black flex justify-center items-center w-full md:w-[30%] rounded-md text-sm md:text-base">
                {job.title}
              </div>
              <div className="p-2 text-black flex justify-center items-center w-full md:w-[30%] rounded-md text-sm md:text-base">
                {job.salary}
              </div>
              <div className="p-2 text-black flex justify-center items-center w-full md:w-[30%] rounded-md text-sm md:text-base">
                {job.type}
              </div>
              <div className="p-2 text-black flex justify-center items-center w-full md:w-[30%] rounded-md text-sm md:text-base">
                {`${job.date?.toISOString().slice(0, 10)} - ${job.date
                  ?.toISOString()
                  .slice(11, 19)}`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
