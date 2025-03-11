import jwt from "jsonwebtoken";
// const userAuth = async (req, res, next) => {
//   const token = req.cookies.jwtToken;
//   try {
//     if (!token) {
//       res.status(401).json({ message: "invalid token" });
//     }
//     const decoded = await jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "unauthorized" });
//   }
// };

const userAuth = (req, res, next) => {
  const token = req.headers["authorization"].split("Bearer ")[1];
  try {
    if (!token) {
      res.status(401).json({ message: "invalid token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "unauthorized" });
  }
};

export default userAuth;
