import { Response } from "express";
import Board from "../models/board.model";
import Pin from "../models/pin.model";
import { AsyncRequest } from "../types/authRequest";
import { ApiError, asyncHandler } from "../utils/http";

const shapeBoard = (board: any) => ({
  ...board,
  pinsCount: board.pins?.length || 0,
  cover: board.cover || board.pins?.[0]?.imageUrl || "",
});

export const createBoard = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const name = String(req.body.name || "").trim();
  if (!name) throw new ApiError(400, "Board name is required");

  const board = await Board.create({
    name,
    description: String(req.body.description || "").trim(),
    isSecret: Boolean(req.body.isSecret),
    createdBy: req.userId,
    cover: String(req.body.cover || ""),
  });

  res.status(201).json(shapeBoard(board.toObject()));
});

export const listBoards = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const filter: any = {};
  if (req.query.userId) filter.createdBy = String(req.query.userId);
  if (req.query.mine === "1") {
    if (!req.userId) return res.json([]);
    filter.createdBy = req.userId;
  }

  const boards = await Board.find(filter)
    .populate("createdBy", "username name avatar")
    .populate("pins", "imageUrl title")
    .sort({ createdAt: -1 })
    .lean();

  res.json(boards.filter((board) => !board.isSecret || String(board.createdBy?._id) === req.userId).map(shapeBoard));
});

export const getBoard = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const board = await Board.findById(req.params.id)
    .populate("createdBy", "username name avatar")
    .populate({
      path: "pins",
      populate: { path: "createdBy", select: "username name avatar" },
    })
    .lean();

  if (!board) throw new ApiError(404, "Board not found");
  if (board.isSecret && String(board.createdBy?._id) !== req.userId) {
    throw new ApiError(403, "This board is private");
  }

  res.json(shapeBoard(board));
});

export const updateBoard = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const board = await Board.findOne({ _id: req.params.id, createdBy: req.userId });
  if (!board) throw new ApiError(404, "Board not found");

  if (req.body.name !== undefined) board.name = String(req.body.name).trim();
  if (req.body.description !== undefined) board.description = String(req.body.description).trim();
  if (req.body.isSecret !== undefined) board.isSecret = Boolean(req.body.isSecret);
  if (req.body.cover !== undefined) board.cover = String(req.body.cover);
  await board.save();

  res.json(shapeBoard(board.toObject()));
});

export const deleteBoard = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const board = await Board.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });
  if (!board) throw new ApiError(404, "Board not found");
  res.json({ message: "Board deleted" });
});

export const addPin = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const pinId = String(req.body.pinId || "");
  const board = await Board.findOne({ _id: req.params.id, createdBy: req.userId });
  if (!board) throw new ApiError(404, "Board not found");

  const pin = await Pin.findById(pinId);
  if (!pin) throw new ApiError(404, "Pin not found");

  if (!board.pins.some((id) => String(id) === pinId)) {
    board.pins.push(pin._id);
    if (!board.cover) board.cover = pin.imageUrl;
    await board.save();
  }

  res.json(shapeBoard(board.toObject()));
});

export const removePin = asyncHandler(async (req: AsyncRequest, res: Response) => {
  const board = await Board.findOne({ _id: req.params.id, createdBy: req.userId });
  if (!board) throw new ApiError(404, "Board not found");

  board.pins = board.pins.filter((id) => String(id) !== req.params.pinId);
  await board.save();
  res.json(shapeBoard(board.toObject()));
});
