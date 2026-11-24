import mongoose from "mongoose";
import Note from "../models/Note.js";
import Tag from "../models/Tag.js";
import { ApiError, asyncHandler } from "../utils/http.js";

const ownedNote = async (id, userId) => {
  const note = await Note.findOne({ _id: id, user: userId }).populate("tags");
  if (!note) throw new ApiError(404, "Note not found");
  return note;
};

const cleanTags = async (tags, userId) => {
  if (!Array.isArray(tags)) return undefined;

  const ids = tags.filter((tag) => mongoose.isValidObjectId(tag));
  const owned = await Tag.find({ _id: { $in: ids }, user: userId }).select("_id");
  return owned.map((tag) => tag._id);
};

export const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !String(title).trim()) {
    throw new ApiError(400, "Note title is required");
  }
  if (!content || !String(content).trim()) {
    throw new ApiError(400, "Note content is required");
  }

  const note = await Note.create({
    title: String(title).trim(),
    content,
    user: req.user._id,
    tags: (await cleanTags(tags, req.user._id)) || [],
  });

  res.status(201).json(await note.populate("tags"));
});

export const getNotes = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };

  if (req.query.tag) {
    const tag = await Tag.findOne({
      name: String(req.query.tag),
      user: req.user._id,
    });
    if (!tag) return res.json([]);
    filter.tags = tag._id;
  }

  if (req.query.search) {
    filter.$or = [
      { title: { $regex: String(req.query.search), $options: "i" } },
      { content: { $regex: String(req.query.search), $options: "i" } },
    ];
  }

  const notes = await Note.find(filter)
    .populate("tags")
    .sort({ updatedAt: -1 });

  res.json(notes);
});

export const getNoteById = asyncHandler(async (req, res) => {
  res.json(await ownedNote(req.params.id, req.user._id));
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await ownedNote(req.params.id, req.user._id);
  const { title, content, tags } = req.body;

  if (title !== undefined) {
    if (!String(title).trim()) throw new ApiError(400, "Title cannot be empty");
    note.title = String(title).trim();
  }

  if (content !== undefined) {
    if (!String(content).trim()) throw new ApiError(400, "Content cannot be empty");
    note.content = content;
  }

  if (tags !== undefined) {
    note.tags = (await cleanTags(tags, req.user._id)) || [];
  }

  await note.save();
  res.json(await note.populate("tags"));
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await ownedNote(req.params.id, req.user._id);
  await note.deleteOne();
  res.json({ message: "Note removed" });
});
