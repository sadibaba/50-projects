// backend/src/controllers/user.controller.ts
import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import User from "../models/user.model";
import Pin from "../models/pin.model";
import Board from "../models/board.model";
import mongoose from "mongoose";

export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (id === currentUserId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);

    if (!userToFollow.followers.some(f => f.equals(currentUserObjectId))) {
      userToFollow.followers.push(currentUserObjectId);
      currentUser.following.push(userToFollow._id);
      await userToFollow.save();
      await currentUser.save();
    }

    res.json({ 
      message: "Followed successfully",
      followersCount: userToFollow.followers.length 
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userToUnfollow = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (f) => f.toString() !== currentUserId
    );
    currentUser.following = currentUser.following.filter(
      (f) => f.toString() !== id
    );

    await userToUnfollow.save();
    await currentUser.save();

    res.json({ 
      message: "Unfollowed successfully",
      followersCount: userToUnfollow.followers.length 
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const pins = await Pin.find({ createdBy: id })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username email");
    
    const boards = await Board.find({ createdBy: id });

    // Calculate total likes from user's pins
    const totalLikes = pins.reduce((total, pin) => total + (pin.likes?.length || 0), 0);

    res.json({
      user,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      totalLikes,
      pins,
      boards
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};