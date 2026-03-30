import Tag from "../models/Tag.js";

// @desc    Create new tag
// @route   POST /api/tags
export const createTag = async (req, res) => {
  const { name } = req.body;

  try {
    const tagExists = await Tag.findOne({ name });
    if (tagExists) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    const tag = await Tag.create({ name });
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tags
// @route   GET /api/tags
export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find({});
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete tag
// @route   DELETE /api/tags/:id
export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (tag) {
      await tag.deleteOne();
      res.json({ message: "Tag removed" });
    } else {
      res.status(404).json({ message: "Tag not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
