import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log("db connected");
  } catch (error) {
    console.log("database error", error.message);
  }
};

export default dbConnect;
