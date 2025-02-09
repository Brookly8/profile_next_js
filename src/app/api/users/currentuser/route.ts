import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import user from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    const userID = await getDataFromToken(request);
    const findedUser = await user.findOne({ _id: userID }).select("-password");

    return NextResponse.json({
      message: "User found",
      data: findedUser,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Session expired. Redirecting to login..." },
        { status: 401, headers: { Location: "/login" } } // ✅ Send 401 status
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
