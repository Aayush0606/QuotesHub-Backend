import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.send(401).json({ error: "Give correct auth token" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SCERET);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Give correct auth token" });
  }
};

export default fetchUser;
