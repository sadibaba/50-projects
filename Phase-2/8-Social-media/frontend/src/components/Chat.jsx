    import { useState, useEffect, useRef } from "react";
import { getSocket } from "../services/socket";

function Chat({ selectedUser, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    if (!selectedUser) return;
    
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/messages/${selectedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    
    const handleNewMessage = (message) => {
      if (message.sender._id === selectedUser?._id || message.receiver._id === selectedUser?._id) {
        setMessages((prev) => [...prev, message]);
      }
    };
    
    const handleTyping = (data) => {
      if (data.userId === selectedUser?._id) {
        setOtherUserTyping(data.isTyping);
      }
    };
    
    socket.on("new-message", handleNewMessage);
    socket.on("user-typing", handleTyping);
    socket.on("message-sent", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    
    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("user-typing", handleTyping);
      socket.off("message-sent");
    };
  }, [socket, selectedUser]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    
    socket.emit("private-message", {
      receiverId: selectedUser._id,
      message: newMessage,
    });
    
    setNewMessage("");
  };

  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { receiverId: selectedUser._id, isTyping: true });
      setTimeout(() => {
        setIsTyping(false);
        socket.emit("typing", { receiverId: selectedUser._id, isTyping: false });
      }, 1000);
    }
  };

  if (!selectedUser) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {selectedUser.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="text-white font-semibold">{selectedUser.username}</h3>
              {otherUserTyping && <p className="text-xs text-gray-400">Typing...</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender._id === currentUser?._id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-xl ${
                  msg.sender._id === currentUser?._id
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                <p>{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            onKeyUp={handleTypingStart}
            placeholder="Type a message..."
            className="flex-1 p-3 bg-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;