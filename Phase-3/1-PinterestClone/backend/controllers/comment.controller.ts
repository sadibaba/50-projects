// backend/src/controllers/comment.controller.ts
import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Comment from "../models/comments";
import Pin from "../models/pin.model";

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; 
    const { text } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) return res.status(401).json({ error: "Unauthorized" });

    const pin = await Pin.findById(id);
    if (!pin) return res.status(404).json({ error: "Pin not found" });

    const comment = new Comment({
      text,
      userId: currentUserId,
      pinId: id
    });

    await comment.save();
    
    // Populate user data before returning
    const populatedComment = await Comment.findById(comment._id).populate("userId", "username email profilePicture bio");

    res.json({ message: "Comment added", comment: populatedComment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; 
    const comments = await Comment.find({ pinId: id })
      .populate("userId", "username email profilePicture bio")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; 
    const currentUserId = req.user?.id;

    if (!currentUserId) return res.status(401).json({ error: "Unauthorized" });

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.userId.toString() !== currentUserId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};