import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Pin from "../models/pin.model";
import Board from "../models/board.model";

export const search = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const searchTerm = String(query); 

    const pins = await Pin.find({ title: { $regex: searchTerm, $options: "i" } });
    const boards = await Board.find({ name: { $regex: searchTerm, $options: "i" } });

    res.json({ pins, boards });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
