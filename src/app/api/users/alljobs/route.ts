import { NextResponse } from "next/server";
import job from "@/models/jobsModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET() {
  try {
    const allJobs = await job.find();

    return NextResponse.json({ success: true, jobs: allJobs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
