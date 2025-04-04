import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
   chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: [true, "Chat ID is required"],
   },
   senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Sender ID is required"]
   },
   messageType: {
    type: String,
    enum: ["text", "image",  "video",  "file"],
    required: [true, "message type is required"]
   },
   messageContent: {
    type: String,
    default: null
   },
   mediaUrl: {
    type: String,
    default: null
   },
   isEdited: {
    type: Boolean,
    default: false
   }
}, {timestamps: true})

const Message = mongoose.model("Message", messageSchema);
export default Message;