import express, { Request, Response } from 'express';

import { ChatModel, findChatsByUserId } from "../../model/chat/ChatModel";
import { UserModel, findUserByField } from "../../model/user/UserModel"; 

const router = express.Router();

router.post('/chat/create', async (req: Request, res: Response) => {
    try {
        const { usersId } = req.body;

        for (let i = 0; i < usersId.length; i++) {
            const user = UserModel.findById(usersId[i]);

            if (!user) {
                res.status(400).json({ message: `Invalid user ID: ${usersId[i]}` });
                return;
            }
        }
        const checkChat = await ChatModel.findOne({ usersId: usersId });
        if (checkChat) {
            res.status(400).json({ message: 'Chat already exists' });
            return;
        }
        const newChat = new ChatModel({
            usersId
        });
        await newChat.save();
        res.status(201).json({ message: 'Chat created successfully' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/chat', async (req: Request, res: Response) => {
    const chatId = req.query.chatId;
    const chat = await ChatModel.findById(chatId);
    chat ? res.status(200).json(chat) : res.status(404).json({ message: 'Chat not found' });
});

router.get('/chat/delete', async (req: Request, res: Response) => {
    const chatId = req.query.chatId;
    const chat = await ChatModel.findByIdAndDelete(chatId);
    chat ? res.status(200).json({ message: 'Chat deleted successfully' }) : res.status(404).json({ message: 'Chat not found' });
});

router.get('/chat/list', async (req: Request, res: Response) => {
    
    const userId = req.query.userId as string;
    // console.log(userId);
    // console.log(findChatsByUserId(userId));
    const chats = userId ? await findChatsByUserId(userId) : await ChatModel.find();
    chats.length ? res.status(200).json(chats) : res.status(404).json({ message: 'No chats found' });
});

export default router;