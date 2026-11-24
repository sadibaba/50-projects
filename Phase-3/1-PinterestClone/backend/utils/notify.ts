import Notification from "../models/notification.model";

export const notify = async (data: {
  recipient: string;
  actor: string;
  type: "like" | "comment" | "follow" | "save";
  pin?: string;
  board?: string;
}) => {
  if (!data.recipient || String(data.recipient) === String(data.actor)) return;
  await Notification.create({
    recipient: data.recipient,
    actor: data.actor,
    type: data.type,
    pin: data.pin,
    board: data.board,
  });
};
