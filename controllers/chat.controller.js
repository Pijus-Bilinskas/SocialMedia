import mongoose from "mongoose"
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

export const personalMessageCreate = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const { recipientId, messageContent } = req.body;
        const senderId = req.user._id.toString();

        if(!recipientId || !messageContent){
            
            return res.status(400).json({ message: "Recipient and content are required" });
        }

        let chat = await Chat.findOne({
            participants: { $all: [senderId, recipientId] }
        }).session(session)

        if(!chat){
            chat = new Chat({
                participants: [senderId, recipientId],
                type: "personal"
            });
            await chat.save({ session })
        }

        const message = new Message({
            chatId: chat._id,
            senderId: senderId,
            messageType: "text",
            messageContent: messageContent
        });

        await message.save({ session })

        chat.messages.push(message._id);
        await chat.save({ session })

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ success: true, message: "Message sent successfully", data: message })
    } catch (error){
        await session.abortTransaction()
        session.endSession();
        next(error)
    }
} 

export const personalMessageDelete = async (req, res, next) => {
        const session = await mongoose.startSession();
        session.startTransaction()
    try {
        // const message = await mongoose.Message.findOne({ chatId: req.params.id  ,senderId: req.user._id, id:  })
        
        const message = await mongoose.Message.findById(req.body.messageId)

        if(!message){
            return res.status(404).json({ message: "Message was not found" })
        }

        if(message.senderId !== req.user._id){
            return res.status(401).json({ message: "Message senderId does not match with users" })
        }

        const chat = await mongoose.Chat.findById(message.chatId)

        if(!chat){
            return res.status(404).json({ message: "Chat was not found" })
        }

        await message.deleteOne({ session })
        
        chat.messages.filter(msgId => msgId.toString() !== message._id.toString());
        await chat.save({ session })

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ success: true, message: "Successfully deleted message" })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const personalMessages = async (req, res, next) => {
    try{
        const chat = await mongoose.Chat.findOne({ participants: {$all: [req.user._id, req.body.otherUserId]} });
        if(!chat){
            return res.status(404).json({ message: "Chat was not found" })
        }
        if(!chat.participants.includes(req.user._id)){
            return res.status(403).json({ message: "User not found within participants" })
        }
        
        const messages = await mongoose.Message.find({ chatId: chat._id})

        return res.status(200).json({ success: true, data: messages })
    } catch (error) {
        next(error)
    }
}