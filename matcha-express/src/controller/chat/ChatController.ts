import express, { Request, Response } from 'express';

import { ChatModel, findChatsByUserId, IChat } from "../../model/chat/ChatModel";
import { UserModel, findUserByField } from "../../model/user/UserModel";

const router = express.Router();

router.post('/chat/create', async (req: Request, res: Response) => {
    try {
        const { users } = req.body;
        for (let i = 0; i < users.length; i++) {
            const user = UserModel.findById(users[i]);

            if (!user) {
                res.status(400).json({ message: `Invalid user ID: ${users[i]}` });
                return;
            }
        }
        const checkChat = await ChatModel.findOne({ usersId: users });
        if (checkChat) {
            res.status(200).json({ message: checkChat._id });
            return;
        }
        const newChat = new ChatModel({
            usersId: users
        });
        res.status(201).json({ message: (await newChat.save())._id });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/chat/get', async (req: Request, res: Response) => {
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


    const userId: string = req.query?.userId as string;
    try {
        const chats: IChat[] = await findChatsByUserId(userId) || [];
        const result: any[] = [];
        for await (const chat of chats) {
            // @ts-ignore
            const id = (chat.usersId[0]._id) != userId ? chat.usersId[0]._id : chat.usersId[1]._id;
            const user = await UserModel.findById(id);
            chat["title"] = user?.username || "Unknown";
            // @ts-ignore
            result.push({ ...(chat._doc), title: user?.username || "Unknown", icon: user?.avatar || "" });
        }
        chats.length ? res.status(200).json(result) : res.status(404).json({ message: 'No chats found' });
    } catch (error) {
        res.status(404).json({ message: "invalid userid" });
    }
});

export default router;