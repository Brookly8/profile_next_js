import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("successfully connected");
    });

    connection.on("error", (err) => {
      console.log("error" + err);
    });
  } catch (error) {
    console.log(error);
  }
}
