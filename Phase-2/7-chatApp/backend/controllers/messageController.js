import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    console.log("Send message request body:", req.body);
    const { sender, receiver, text } = req.body;
    
    // Validate required fields
    if (!sender || !receiver || !text) {
      return res.status(400).json({ error: "Sender, receiver, and text are required" });
    }

    const message = new Message({ sender, receiver, text });
    await message.save();
    
    console.log("Message saved:", message._id);
    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.query;
    console.log("Get messages for sender:", sender, "receiver:", receiver);
    
    if (!sender || !receiver) {
      return res.status(400).json({ error: "Sender and receiver are required" });
    }

    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort({ createdAt: 1 });
    
    console.log(`Found ${messages.length} messages`);
    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};