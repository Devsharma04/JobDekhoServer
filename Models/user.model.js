import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    emailToken: {
      type: String,
    },

    isMailVerified: {
      type: Boolean,
      default: false,
    },
    OTP: {
      type: String,
    },
    Role: {
      type: String,
      default: null,
    },
    jobsCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobs",
      },
    ],
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobs",
      },
    ],
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String },
      profilepic: { type: String, default: "" },
    },
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
