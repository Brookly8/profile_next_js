import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "Please provide a title"],
  },
  salary: {
    type: String,
    require: [true, "Please provide a salary"],
  },
  type: {
    type: String,
    require: [true, "Please provide a type"],
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

const job = mongoose.models.jobs || mongoose.model("jobs", jobsSchema);

export default job;
