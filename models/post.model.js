import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, "Id is required"],
    },
    userId: {
        type: String,
        required: [true, "User Id is required"],
    },
    description: {
        type: String,
    },
    contentType: {
        type: String,
        enum: ["image", "video"],
        required: [true, "Post Content is required"],
    },
    content: {
        type: String,
        required: [true, "Content URL is required"],
    },
}, {timestamps: true});

const Post = mongoose.model("Post", postSchema);
export default Post;