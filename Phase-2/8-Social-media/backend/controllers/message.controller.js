import Message from '../models/message_model.js'
import User from '../models/user_model.js'


export const getMessages = async (req , res) =>{
    try{
        const {userId} = req.params
        const currentUserId = req.user.userId
        const messages = await Message.find({
            $or:[
                {sender:currentUserId,receiver:userId},
                {sender:userId,receiver:currentUserId}
            ],
        }).populate("sender receiver", "username email").sort({createdAt:1})
        res.json(messages)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}


export const getChatUsers = async (req,res)=>{
    try{
        const currentUserId = req.user.userId
        const messages = await Message.find({
            $or:[
                {sender:currentUserId},
                {receiver:currentUserId}
            ],
        }).populate('sender receiver','username email')
        const chatUsers = new Map()
        messages.forEach((msg) =>{
            const otherUser = 
            msg.sender._id.toString()=== currentUserId 
            ?msg.receiver
            :msg.sender
            if(!chatUsers.has(otherUser._id.toString())){
                chatUsers.set(otherUser._id.toString(),{
                    _id:otherUser._id,
                    username:otherUser.username,
                    email:otherUser.email,
                    lastMessage:msg.message,
                    lastMessageTime:msg.createdAt,
                })
            }
        })
        res.json(Array.from(chatUsers.values()))
    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.userId;

    const Message = (await import("../models/message_model.js")).default;
    
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message: message,
    });
    
    await newMessage.save();
    
    const populatedMessage = await newMessage.populate("sender receiver", "username email");
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};