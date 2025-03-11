import mongoose from "mongoose";
import express from "express";

const app = express();
app.use(express.json());

const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/ecommerce");
    console.log("db connected");
  } catch (error) {
    console.log("database error", error.message);
  }
};

dbConnect();

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: [true, "price is req"],
  },
  category: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  purchasedProduct: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const product = mongoose.model("Product", productSchema);
const user = mongoose.model("User", userSchema);

app.post("/user", async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = new user({ name, email });
    await newUser.save();

    res.status(201).json({ message: "user created successfully" });
  } catch (error) {}
});
app.post("/addproduct/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  try {
    await user.findByIdAndUpdate(userId, {
      $push: { purchasedProduct: productId },
    });
    res.status(201).json({ message: "product added successfully" });
  } catch (error) {
    console.log("server error", error.message);
  }
});

app.post("/product", async (req, res) => {
  const { name, price, category } = req.body;
  try {
    const newProduct = new product({ name, price, category });
    await newProduct.save();
    res.status(201).json({ message: "product created successfully" });
  } catch (error) {
    console.log("server error", error.message);
  }
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const users = await user.findById(id).populate("purchasedProduct");
    res.status(200).json({ users });
  } catch (error) {
    console.log("server error", error.message);
  }
});

app.listen(3000, () => console.log("server is running on port 3000"));
