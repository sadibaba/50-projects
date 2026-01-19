import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token, auth denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;  

    next();
  } catch (err) {
    res.status(400).json({ msg: "Token invalid" });
  }
};