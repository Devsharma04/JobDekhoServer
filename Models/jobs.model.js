import mongoose from "mongoose";

const jobSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    Salary: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    CreatedBy: {
      type: String,
      required: true,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Jobs = mongoose.model("Jobs", jobSchema);
export default Jobs;
