import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface IdecodedToken {
  id: string;
  email: string;
  username: string;
}

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";

    const decodedToken = jwt.verify(token, process.env.TOKEN!) as IdecodedToken;

    return decodedToken.id;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
