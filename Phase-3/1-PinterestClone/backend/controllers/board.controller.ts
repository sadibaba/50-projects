import { Request, Response } from "express";
import Board from "../models/board.model";

export const createBoard = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const board = new Board({
      name,
      description,
      createdBy: (req as any).user.id,
    });
    await board.save();
    res.status(201).json(board);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getBoards = async (_req: Request, res: Response) => {
  try {
    const boards = await Board.find().populate("createdBy", "username");
    res.json(boards);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addPinToBoard = async (req: Request, res: Response) => {
  try {
    const { boardId, pinId } = req.body;
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ error: "Board not found" });

    board.pins.push(pinId);
    await board.save();

    res.json(board);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
