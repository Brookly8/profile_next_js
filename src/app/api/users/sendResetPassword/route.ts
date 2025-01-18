import { NextRequest, NextResponse } from "next/server";
import user from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { sendMail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;
    console.log(reqBody);
    const userFromDB = await user.findOne({ email });
    //checking if user exists!
    if (!userFromDB) {
      return NextResponse.json(
        { error: "user does not exists" },
        { status: 400 }
      );
    }

    await sendMail({ email, emailType: "RESET", userId: userFromDB._id });

    return NextResponse.json({
      message: "reset password request was successfully sended on email",
      success: true,
      userFromDB,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
