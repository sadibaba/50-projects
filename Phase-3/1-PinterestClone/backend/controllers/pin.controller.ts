import { Response } from "express";
import mongoose from "mongoose";
import Pin from "../models/pin.model";
import Board from "../models/board.model";
import Comment from "../models/comments";
import Notification from "../models/notification.model";
import User from "../models/user.model";
import { AsyncRequest } from "../types/authRequest";
import { ApiError, asyncHandler, parsePage } from "../utils/http";
import { notify } from "../utils/notify";

const authorFields = "username name avatar";

const shape = (pin: any, userId?: string) => {
  const likes = (pin.likes || []).map(String);
  const saves = (pin.saves || []).map(String);
  return {
    ...pin,
    likesCount: likes.length,
    savesCount: saves.length,
    commentsCount: pin.commentsCount || 0,
    liked: Boolean(userId && likes.includes(userId)),
    saved: Boolean(userId && saves.includes(userId)),
  };
};

const canEdit = (pin: any, userId: string) => String(pin.createdBy?._id || pin.createdBy) === userId;

export const listPins = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const { page, limit, skip } = parsePage(req.query.page, req.query.limit);
  const filter: any = {};
  const q = String(req.query.q || "").trim();
  const category = String(req.query.category || "").trim();
  const type = String(req.query.type || "").trim();
  const userId = req.query.userId ? String(req.query.userId) : "";
  const saved = String(req.query.saved || "");
  const liked = String(req.query.liked || "");
  const following = String(req.query.following || "");

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ];
  }
  if (category && category !== "All") filter.category = category;
  if (type === "image" || type === "video") filter.type = type;
  if (userId) filter.createdBy = userId;
  if (saved === "me" && req.userId) filter.saves = req.userId;
  if (liked === "me" && req.userId) filter.likes = req.userId;
  if (following === "me" && req.userId) {
    const user = await User.findById(req.userId).select("following");
    filter.createdBy = { $in: [...(user?.following || []), req.userId] };
  }

  const sort: any = String(req.query.sort) === "popular"
    ? { views: -1, likes: -1, createdAt: -1 }
    : { createdAt: -1 };

  const [pins, total] = await Promise.all([
    Pin.find(filter)
      .populate("createdBy", authorFields)
      .populate("board", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Pin.countDocuments(filter),
  ]);

  res.json({
    pins: pins.map((pin) => shape(pin, req.userId)),
    page,
    total,
    hasMore: skip + pins.length < total,
  });
});

export const getPin = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const pin = await Pin.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("createdBy", authorFields)
    .populate("board", "name")
    .lean();

  if (!pin) throw new ApiError(404, "Pin not found");

  const related = await Pin.find({ category: pin.category, _id: { $ne: pin._id } })
    .populate("createdBy", authorFields)
    .limit(8)
    .lean();

  res.json({
    ...shape(pin, req.userId),
    related: related.map((item) => shape(item, req.userId)),
  });
});

export const createPin = asyncHandler(async (req: AsyncRequest, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Authentication required");
  const title = String(req.body.title || "").trim();
  const imageUrl = String(req.body.imageUrl || "").trim();
  if (!title) throw new ApiError(400, "A title is required");
  if (!imageUrl) throw new ApiError(400, "An image is required");

  const videoUrl = String(req.body.videoUrl || "").trim();
  const tags = Array.isArray(req.body.tags)
    ? req.body.tags.map((tag: string) => String(tag).trim()).filter(Boolean)
    : String(req.body.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean);

  let boardId: string | undefined;
  if (req.body.boardId) {
    const board = await Board.findOne({ _id: req.body.boardId, createdBy: req.userId });
    if (!board) throw new ApiError(404, "Board not found");
    boardId = String(board._id);
  }

  const pin = await Pin.create({
    title,
    description: String(req.body.description || "").trim(),
    imageUrl,
    videoUrl,
    posterUrl: String(req.body.posterUrl || imageUrl),
    type: videoUrl ? "video" : "image",
    category: String(req.body.category || "Inspiration").trim(),
    tags,
    sourceName: String(req.body.sourceName || "Uploaded"),
    sourceUrl: String(req.body.sourceUrl || ""),
    createdBy: req.userId,
    board: boardId,
    width: Number(req.body.width) || 600,
    height: Number(req.body.height) || 900,
  });

  if (boardId) {
    await Board.findByIdAndUpdate(boardId, {
      $addToSet: { pins: pin._id },
      $set: { cover: pin.imageUrl },
    });
  }

  const populated = await Pin.findById(pin._id).populate("createdBy", authorFields).lean();
  res.status(201).json(shape(populated, req.userId));
});

export const updatePin = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const pin = await Pin.findById(req.params.id);
  if (!pin) throw new ApiError(404, "Pin not found");
  if (!req.userId || !canEdit(pin, req.userId)) throw new ApiError(403, "You can only edit your own pins");

  const fields = ["title", "description", "imageUrl", "videoUrl", "posterUrl", "category", "tags", "sourceName", "sourceUrl"];
  for (const field of fields) {
    if (req.body[field] !== undefined) (pin as any)[field] = req.body[field];
  }
  if (pin.videoUrl) pin.type = "video";
  await pin.save();

  const populated = await Pin.findById(pin._id).populate("createdBy", authorFields).lean();
  res.json(shape(populated, req.userId));
});

export const deletePin = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const pin = await Pin.findById(req.params.id);
  if (!pin) throw new ApiError(404, "Pin not found");
  if (!req.userId || !canEdit(pin, req.userId)) throw new ApiError(403, "You can only delete your own pins");

  await Promise.all([
    Board.updateMany({}, { $pull: { pins: pin._id } }),
    Comment.deleteMany({ pin: pin._id }),
    Notification.deleteMany({ pin: pin._id }),
  ]);
  await pin.deleteOne();
  res.json({ message: "Pin deleted" });
});

export const likePin = asyncHandler(async (req: AsyncRequest, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Authentication required");
  const pin = await Pin.findById(req.params.id);
  if (!pin) throw new ApiError(404, "Pin not found");

  if (!pin.likes.some((id) => String(id) === req.userId)) {
    pin.likes.push(new mongoose.Types.ObjectId(req.userId));
    await pin.save();
    await notify({ recipient: String(pin.createdBy), actor: req.userId, type: "like", pin: String(pin._id) });
  }

  res.json({ liked: true, likesCount: pin.likes.length });
});

export const unlikePin = asyncHandler(async (req: AsyncRequest, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Authentication required");
  const pin = await Pin.findById(req.params.id);
  if (!pin) throw new ApiError(404, "Pin not found");

  pin.likes = pin.likes.filter((id) => String(id) !== req.userId);
  await pin.save();
  res.json({ liked: false, likesCount: pin.likes.length });
});

export const savePin = asyncHandler(async (req: AsyncRequest, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Authentication required");
  const pin = await Pin.findById(req.params.id);
  if (!pin) throw new ApiError(404, "Pin not found");

  if (!pin.saves.some((id) => String(id) === req.userId)) {
    pin.saves.push(new mongoose.Types.ObjectId(req.userId));
    await pin.save();
    await notify({ recipient: String(pin.createdBy), actor: req.userId, type: "save", pin: String(pin._id) });
  }

  if (req.body.boardId) {
    const board = await Board.findOne({ _id: req.body.boardId, createdBy: req.userId });
    if (!board) throw new ApiError(404, "Board not found");
    await Board.findByIdAndUpdate(board._id, {
      $addToSet: { pins: pin._id },
      $set: { cover: pin.imageUrl },
    });
  }

  res.json({ saved: true, savesCount: pin.saves.length });
});

export const unsavePin = asyncHandler(async (req: AsyncRequest, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Authentication required");
  const pin = await Pin.findById(req.params.id);
  if (!pin) throw new ApiError(404, "Pin not found");

  pin.saves = pin.saves.filter((id) => String(id) !== req.userId);
  await pin.save();

  await Board.updateMany(
    { createdBy: req.userId },
    { $pull: { pins: pin._id } }
  );

  res.json({ saved: false, savesCount: pin.saves.length });
});
