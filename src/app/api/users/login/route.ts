import { connect } from "@/dbConfig/dbConfig";
import user from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);
    const userFromDB = await user.findOne({ email });
    //checking if user exists!
    if (!userFromDB) {
      return NextResponse.json(
        { error: "user does not exists" },
        { status: 400 }
      );
    }

    const validPassword = await bcryptjs.compare(password, userFromDB.password);
    //checking if  password is valid!
    if (!validPassword) {
      return NextResponse.json({ error: "invalid password" }, { status: 400 });
    }

    const tokenPresent = userFromDB.isVerified;
    if (!tokenPresent) {
      return NextResponse.json(
        { error: "email not verified" },
        { status: 400 }
      );
    }
    //creating tokenData
    const tokenData = {
      id: userFromDB._id,
      username: userFromDB.username,
      email: userFromDB.email,
    };
    //creating token!
    const token = await jwt.sign(tokenData, process.env.TOKEN!, {
      expiresIn: "10s",
    });

    const response = NextResponse.json({
      message: "Login successul",
      success: true,
    });

    response.cookies.set("token", token, { httpOnly: true });

    return response;
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
