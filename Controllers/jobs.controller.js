import User from "../Models/user.model.js";
import Job from "../Models/jobs.model.js";
import customError from "../Utils/customError.js";

const createJob = async (req, res) => {
  const { company, position, description, Salary, location } = req.body;
  const { id } = req.user;
  if (!company || !position || !description || !Salary || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const newjob = await Job.create({
    company,
    position,
    description,
    Salary,
    location,
    CreatedBy: id,
  });

  const user = await User.findByIdAndUpdate(
    id,
    { $push: { jobsCreated: newjob._id } },
    { new: true }
  );
  res.status(201).json({ message: "job created successfully" });
};

const createdJobs = async (req, res) => {
  const { id } = req.user;
  const jobs = await User.findById(id).populate({
    path: "jobsCreated",
    populate: {
      path: "applicants", // Ensure applicants are also populated
    },
  });

  res.status(200).json(jobs.jobsCreated);
};
//////////////////////////////////////////////////////////////////////////////////////////////////
const deleteJob = async (req, res) => {
  const { jobId } = req.params;
  const { id } = req.user;
  const job = await Job.findByIdAndDelete(jobId);

  await User.findByIdAndUpdate(
    id,
    { $pull: { jobsCreated: jobId } },
    { new: true }
  );

  if (!job) {
    res.status(404).json({ message: "job not found" });
    throw new customError(404, "job not found");
  }

  res.status(200).json({ message: "job deleted successfully" });
};
//////////////////////////////////////////////////////////////////////////////////////////////////

const applyJobController = async (req, res) => {
  const { jobId } = req.params;
  const { id } = req.user;
  // add job id to user's applied job's field
  const user = await User.findById(id);
  if (user.appliedJobs.includes(jobId)) {
    res.status(400).json({ message: "job already applied" });
  }
  if (!user.profile.resume) {
    res.status(400).json({ message: "resume is required" });
  }

  await User.findByIdAndUpdate(
    id,
    { $push: { appliedJobs: jobId } },
    { new: true }
  );

  await Job.findByIdAndUpdate(jobId, {
    $push: { applicants: id },
  });

  res.status(200).json({ message: "job applied successfully" });
};

export { createJob, createdJobs, applyJobController, deleteJob };
