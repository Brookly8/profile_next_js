import user from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, password } = reqBody;
    console.log(token);

    const thisUser = await user.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!thisUser) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    console.log(thisUser);

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    thisUser.forgotPasswordToken = undefined;
    thisUser.forgotPasswordTokenExpiry = undefined;
    thisUser.password = hashedPassword;

    thisUser.save();

    return NextResponse.json(
      { message: "password changed succesessfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
