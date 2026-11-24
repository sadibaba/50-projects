import Tag from "../models/Tag.js";
import Note from "../models/Note.js";
import { ApiError, asyncHandler } from "../utils/http.js";

export const createTag = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();

  if (!name) throw new ApiError(400, "Tag name is required");
  if (name.length > 40) throw new ApiError(400, "Tag name is too long");

  const exists = await Tag.findOne({ name, user: req.user._id });
  if (exists) throw new ApiError(409, "You already have a tag with this name");

  const tag = await Tag.create({ name, user: req.user._id });
  res.status(201).json(tag);
});

export const getTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find({ user: req.user._id }).sort({ name: 1 });
  res.json(tags);
});

export const deleteTag = asyncHandler(async (req, res) => {
  const tag = await Tag.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!tag) throw new ApiError(404, "Tag not found");

  await Note.updateMany(
    { user: req.user._id },
    { $pull: { tags: tag._id } }
  );

  res.json({ message: "Tag removed" });
});
