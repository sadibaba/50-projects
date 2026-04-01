import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (!foundUser) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const secret: Secret = process.env.JWT_SECRET as string;

   const token = jwt.sign(
  { id: foundUser._id },
  secret,
  { expiresIn: "1d" }
);

    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


