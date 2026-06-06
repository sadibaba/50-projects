import express from 'express'
import {verifyToken} from '../middlewares/auth.middleware.js'
import { getMessages,getChatUsers,sendMessage} from '../controllers/message.controller.js'

const router = express.Router()

router.get('/chat-users',verifyToken,getChatUsers)
router.get('/:userId/messages',verifyToken,getMessages)
router.post("/", verifyToken, sendMessage);

export default router