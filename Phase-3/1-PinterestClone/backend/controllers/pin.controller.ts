import { Request, Response } from "express";
import Pin from "../models/pin.model";

export const createPin = async (req: Request, res: Response) => {
  try {
    const { title, description, imageUrl, board } = req.body;
    const pin = new Pin({
      title,
      description,
      imageUrl,
      createdBy: (req as any).user.id,
      board,
    });
    await pin.save();
    res.status(201).json(pin);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPins = async (_req: Request, res: Response) => {
  try {
    const pins = await Pin.find().populate("createdBy", "username");
    res.json(pins);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Pin.findByIdAndDelete(id);
    res.json({ message: "Pin deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPinById = async (req: Request, res: Response) => {
  try {
    const pin = await Pin.findById(req.params.id).populate("createdBy board");
    if (!pin) return res.status(404).json({ error: "Pin not found" });
    res.json(pin);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};