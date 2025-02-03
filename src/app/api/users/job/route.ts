import { connect } from "@/dbConfig/dbConfig";
import job from "@/models/jobsModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { title, salary, type, date } = reqBody;
  console.log(reqBody);

  const newJob = new job({
    title,
    salary,
    type,
    date,
  });

  const savedJob = await newJob.save();
  console.log(savedJob);

  return NextResponse.json({
    message: "Job created successfully",
    success: true,
    savedJob,
  });
}
