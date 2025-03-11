// user model imports ==========================
import User from "../Models/user.model.js";
import bcrypt from "bcrypt";
import SendEmail from "../Utils/mailer.js";
import Jobs from "../Models/jobs.model.js";
import crypto from "crypto";
import { mailverfytemp, resetpasswordtemp } from "../Templates/mailtemp.js";
import contactUsTemp from "../Templates/contactUs.temp..js";
import customError from "../Utils/customError.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
//users controllers=============================

//signup user controller

const userSignup = async (req, res) => {
  const { fname, lname, email, phone, password } = req.body;

  if (!fname || !lname || !email || !phone || !password) {
    res.status(400).json({ message: "all fields are required" });
    throw new customError(400, "all fields are required");
  }

  //=====hashing password===================

  const hashedPassword = await bcrypt.hash(password, 10);
  // creating token for mail verification=================

  const mailtoken = crypto.randomBytes(12).toString("hex");

  const newUser = await User.create({
    fname,
    lname,
    email,
    phone,
    password: hashedPassword,
    emailToken: mailtoken,
  });
  //getting user info========================
  const user = await User.findOne({ email: email });

  const id = user._id.toString();

  // sending email to user =====================

  SendEmail(
    email,
    "Email Verification",
    mailverfytemp.replace(
      "{Link}",
      `http://localhost:3000/api/mail-verification/${id}/${mailtoken}`
    )
  );

  res.status(201).json({
    message: "user created successfully check mail for verification",
    user: newUser,
  });
};
//////////////////////////////////////////////////////////////////////////////
const userMailVerification = async (req, res) => {
  const { id, emailtoken } = req.params; //token from params

  const user = await User.findOne({ _id: id });

  if (!user) {
    res.status(404).json({ message: "user not found" });
    throw new customError(404, "user not found");
  }
  const verificationtoken = user.emailToken; //token from db

  if (verificationtoken === emailtoken) {
    user.isMailVerified = true;
    user.emailToken = undefined;
    await user.save();
    //redirect to login page
    res.redirect("http://localhost:5173/api/mail-verified-successfully");
  } else {
    res.redirect("http://localhost:5173/api/mail-verification-failed");
    throw new customError(400, "mail verification failed");
  }
};
////////////////////////////////////////////////////////////////////////////////////////
const userpasswordreset = async (req, res) => {
  const { email, OTP, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(404).json({ message: "user not found" });
    throw new customError(404, "user not found");
  }
  if (!OTP && !password) {
    const madeOTP = Math.floor(1000 + Math.random() * 9000);
    user.OTP = madeOTP;

    await user.save();
    SendEmail(
      email,
      "Reset Password",
      resetpasswordtemp.replace("{OTP}", madeOTP)
    );

    res.json({ message: "OTP sent successfully" });
  }

  if (OTP && !password) {
    if (OTP === user.OTP) {
      user.OTP = undefined;
      await user.save();
      // Correct OTP
      return res.status(201).json({
        message: "OTP matched successfully",
      });
    }
    throw new customError(400, "OTP not matched");
  }
  // condition for password reset
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(201).json({
      message: "password reset successfully",
    });
  }
};
///////////////////////////////////////////////// user login///////////////
const userLogin = async (req, res) => {
  const { email, loginpassword } = req.body;
  if (!email || !loginpassword) {
    res.status(400).json({ message: "all fields are required" });
    throw new customError(400, "all fields are required");
  }
  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(404).json({ message: "user not found" });
    throw new customError(404, "user not found");
  }

  const { password, _id } = user;

  const result = await bcrypt.compare(loginpassword, password);
  if (!result) {
    res.status(401).json({ message: "invalid username or password" });
    throw new customError(401, "invalid username or password");
  }

  if (!user.isMailVerified) {
    res.status(401).json({ message: "user is not verified" });
    throw new customError(401, "user is not verified");
  }

  //////////////////////setting token//////////////////////////////////////////

  const token = jwt.sign(
    { id: user._id.toString(), fname: user.fname, role: user.Role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.set("Authorization", `Bearer ${token}`);

  if (user.Role === "Job Seaker") {
    res.status(200).json({
      redirect: `/dashboard`,
    });
  } else if (user.Role === "Recuiter") {
    res.status(200).json({
      redirect: `/RecuterDashboard`,
    });
  } else {
    res.status(200).json({
      redirect: `/Role`,
    });
  }
};
/////////////////////////////////////////////////////////////////////////////////
const userRole = async (req, res) => {
  const { id } = req.user;
  const { role } = req.body;
  const user = await User.findOne({ _id: id });
  if (!user) {
    res.status(404).json({ message: "user not found" });
    throw new customError(404, "user not found");
  }
  if (user.Role) {
    res.status(400).json({ message: "user already has role" });
    throw new customError(400, "user already has role");
  }

  user.Role = role;
  await user.save();
  if (role === "Job Seaker") {
    res.status(200).json({
      redirect: `/dashboard`,
    });
  } else if (role === "Recuiter") {
    res.status(200).json({
      redirect: `/RecuterDashboard`,
    });
  }
  res.status(200).json({
    message: "user role updated successfully",
  });
};
////////////////////////////////////////////////////////////////////////////////////
const getData = async (req, res) => {
  const { id } = req.user;
  const user = await User.findOne({ _id: id });
  if (!user) {
    res.status(404).json({ message: "user not found" });
    throw new customError(404, "user not found");
  }
  res.status(200).json({
    fname: user.fname,
    lname: user.lname,
    email: user.email,
    phone: user.phone,
    bio: user.profile.bio,
    skills: user.profile.skills,
    resume: user.profile.resume,
    img: user.profile.profilepic,
  });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
const profileUpdate = async (req, res) => {
  try {
    const { id } = req.user;
    const { fname, lname, email, phone, bio, skills } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    if (fname) user.fname = fname;
    if (lname) user.lname = lname;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (bio) user.profile.bio = bio;
    if (skills) {
      user.profile.skills = skills.split(/[, ]+/);
    }
    if (req.files?.img) {
      if (user.profile?.profilepic) {
        const oldImgUrl = user.profile.profilepic;
        const fileNameWithExt = oldImgUrl.split("/").pop().split(".")[0];
        const decodedFileNameWithExt = decodeURIComponent(fileNameWithExt); // Decode URL-encoded characters

        const publicId = `Images/${decodedFileNameWithExt}`;

        const deletionResult = await cloudinary.uploader.destroy(publicId);
      }
      user.profile.profilepic = req.files.img[0].path;
    }
    // Handle Resume Upload
    if (req.files?.resume) {
      if (user.profile?.resume) {
        // Extract Cloudinary public_id (folder name + file name without extension)
        const oldResumeUrl = user.profile.resume;
        const fileNameWithExt = oldResumeUrl.split("/").pop().split(".")[0];
        const decodedFileNameWithExt = decodeURIComponent(fileNameWithExt); // Decode URL-encoded characters

        const publicId = `Resumes/${decodedFileNameWithExt}`;

        // Delete old resume from Cloudinary
        const deletionResult = await cloudinary.uploader.destroy(publicId);
      }

      // Save new resume URL
      user.profile.resume = req.files.resume[0].path;
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////

const ShowJobs = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  try {
    const getData = await Jobs.find();

    if (!getData || getData.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }

    res.status(200).json({ getData, appliedJobs: user.appliedJobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

const applications = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ message: "user not found" });
    throw new customError(404, "user not found");
  }
  const applications = await User.findById(id).populate("appliedJobs");
  res.status(200).json(applications.appliedJobs);
};

const contactUs = async (req, res) => {
  const { name, email, message } = req.body;
  const emailtemp = contactUsTemp(name, email, message);
  SendEmail("itsmedev03@gmail.com", "Contact Us", emailtemp);

  res.status(200).json({ message: "Email sent successfully" });
};

export {
  userSignup,
  userMailVerification,
  userpasswordreset,
  userLogin,
  userRole,
  getData,
  profileUpdate,
  ShowJobs,
  applications,
  contactUs,
};
