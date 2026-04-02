import { Request, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Pin from "../models/pin.model";
import mongoose from "mongoose";

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
    const pins = await Pin.find()
      .populate("createdBy", "username email profilePicture bio") 
      .sort({ createdAt: -1 });
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
    const pin = await Pin.findById(req.params.id)
      .populate("createdBy", "username email profilePicture bio") 
      .populate("board");
    if (!pin) return res.status(404).json({ error: "Pin not found" });
    res.json(pin);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const likePin = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) return res.status(401).json({ error: "Unauthorized" });

    const pin = await Pin.findById(id);
    if (!pin) return res.status(404).json({ error: "Pin not found" });

    const userObjectId = new mongoose.Types.ObjectId(currentUserId);

    if (!pin.likes.some(like => like.equals(userObjectId))) {
      pin.likes.push(userObjectId);
      await pin.save();
    }

    // Return the updated pin with likes count
    const updatedPin = await Pin.findById(id).populate("createdBy", "username");
    res.json({ message: "Pin liked", likes: pin.likes.length, pin: updatedPin });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const unlikePin = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) return res.status(401).json({ error: "Unauthorized" });

    const pin = await Pin.findById(id);
    if (!pin) return res.status(404).json({ error: "Pin not found" });

    pin.likes = pin.likes.filter(
      like => like.toString() !== currentUserId
    );
    await pin.save();

    // Return the updated pin with likes count
    const updatedPin = await Pin.findById(id).populate("createdBy", "username");
    res.json({ message: "Pin unliked", likes: pin.likes.length, pin: updatedPin });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Save a pin
export const savePin = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) return res.status(401).json({ error: "Unauthorized" });

    const pin = await Pin.findById(id);
    if (!pin) return res.status(404).json({ error: "Pin not found" });

    const userObjectId = new mongoose.Types.ObjectId(currentUserId);

    if (!pin.saves.some(save => save.equals(userObjectId))) {
      pin.saves.push(userObjectId);
      await pin.save();
    }

    res.json({ message: "Pin saved", saves: pin.saves.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Unsave a pin
export const unsavePin = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) return res.status(401).json({ error: "Unauthorized" });

    const pin = await Pin.findById(id);
    if (!pin) return res.status(404).json({ error: "Pin not found" });

    pin.saves = pin.saves.filter(
      save => save.toString() !== currentUserId
    );
    await pin.save();

    res.json({ message: "Pin unsaved", saves: pin.saves.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


