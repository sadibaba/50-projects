import api from "./api";

export const messageService = {
  getMessages: async (_senderId, receiverId) => {
    const response = await api.get("/messages", {
      params: { receiver: receiverId },
    });
    return response.data;
  },

  sendMessage: async ({ receiver, text }) => {
    const response = await api.post("/messages", { receiver, text });
    return response.data;
  },
};
