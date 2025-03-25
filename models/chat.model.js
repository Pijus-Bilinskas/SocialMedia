import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [ "personal", "group" ],
        required: true
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    groupName: {
        type: String,
        minLength: 2,
        default: null
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function () {
            return this.type === "group"
        }
    },
    groupImage: {
        type: String,
        default: null
    },
    messages: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        },
    ],

}, {timestamps: true})

const Chat = mongoose.model("Chat", chatSchema)
export default Chat;