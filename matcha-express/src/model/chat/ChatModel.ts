import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "../user/UserModel";

interface IChat extends Document {
    messages: {
        sender: string;
        content: string;
        date: Date;
        }[];
    usersId: IUser[];
};

const chatSchema: Schema<IChat> = new mongoose.Schema({
    messages: {
        type: [{
            sender: { type: String, required: true },
            content: { type: String, required: true },
            date: { type: Date, required: true }
        }],
        required: false
    },
    usersId: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        validate: {
            validator: function(usersId: IUser[]) {
                return usersId.length === 2; // Ensure the array length is exactly 2
            },
            message: 'A chat must have exactly two users.'
        },
        required: true
    }
});

export function userIsInChat(chat: IChat, user: IUser): boolean {
    return chat.usersId.includes(user);
}

export async function findChatsByUserId(userId: string): Promise<IChat[]> {
    try {
        const userObjectId = new Types.ObjectId(userId);

        const chats = await ChatModel.find({ usersId: userObjectId }) || null;
        return chats;
    }
    catch (err) {
        throw err;
    }
}

const ChatModel = mongoose.model<IChat>("Chat", chatSchema);

export { ChatModel, IChat };