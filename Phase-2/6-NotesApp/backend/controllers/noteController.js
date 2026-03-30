import Note from "../models/Note.js";

// @desc    Create new note
// @route   POST /api/notes
export const createNote = async (req, res) => {
  const { title, content, tags } = req.body;

  try {
    const note = await Note.create({
      title,
      content,
      user: req.user._id,
      tags,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all notes (optionally filter by tag)
// @route   GET /api/notes
export const getNotes = async (req, res) => {
  const { tag } = req.query;

  try {
    let notes;
    if (tag) {
      notes = await Note.find({ user: req.user._id, tags: tag }).populate("tags");
    } else {
      notes = await Note.find({ user: req.user._id }).populate("tags");
    }

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate("tags");

    if (note && note.user.toString() === req.user._id.toString()) {
      res.json(note);
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
export const updateNote = async (req, res) => {
  const { title, content, tags } = req.body;

  try {
    const note = await Note.findById(req.params.id);

    if (note && note.user.toString() === req.user._id.toString()) {
      note.title = title || note.title;
      note.content = content || note.content;
      note.tags = tags || note.tags;

      const updatedNote = await note.save();
      res.json(updatedNote);
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (note && note.user.toString() === req.user._id.toString()) {
      await note.deleteOne();
      res.json({ message: "Note removed" });
    } else {
      res.status(404).json({ message: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
