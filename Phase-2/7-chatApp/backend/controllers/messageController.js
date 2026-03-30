import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;

    const message = new Message({ sender, receiver, text });
    await message.save();

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.query;

    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort({ createdAt: 1 }); // oldest → newest

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
