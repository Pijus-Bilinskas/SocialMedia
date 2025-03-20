import multer from "multer";
import Post from "../models/post.model.js";
import mongoose from "mongoose";
import { bucket } from "../config/googleCloudStorage.js";
import User from "../models/user.model.js";
import {v4 as uuidv4} from "uuid";

const upload = multer({ storage: multer.memoryStorage() }).single("content");


export const userPosts  = async (req, res, next) => {
    try{
        const user = await User.findOne({ id: req.params.id }).select('-password')

        if(!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error
        }

        const posts = await Post.find({ userId: user.id })


        res.status(200).json({
            success: true,
            data:{
                user,
                posts
            }})
    } catch (error) {
        next(error)
    }
}

export const userPost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ id: req.params.id })

        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error
        }
        res.status(200).json({ success: true, data: post })
    } catch (error) {
        next(error)
    }
}

export const createPost = async (req, res, next) => {
    upload(req, res, async (err) => {
        if(err) return next(err);
        //Handle multer error

        const session = await mongoose.startSession();
        session.startTransaction();
            try{
            const { userId, contentType, description } = req.body;

            if(!req.file || !contentType){
                throw new Error("Missing fields: contentType or content file")
            }
            let contentUrl;

            if(contentType === "video") {
                const blob = bucket.file(`videos/${Date.now()}-${req.file.originalname}`);
                const blobStream = blob.createWriteStream({
                    resumable: false,
                    contentType: req.file.mimetype
                });

                await new Promise((resolve, reject) => {
                    blobStream.on("finish", resolve);
                    blobStream.on("error", reject);
                    blobStream.end(req.file.buffer);
                });
                contentUrl = `https://storage.googleapis.com/${social_media_bucket_1}/${blob.name}`
            } else if(contentType === "image") {
                contentUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
            } else {
                throw new Error("Invalid content type. Has to be image or video")
            }

            const newPost = await Post.create([{ userId, contentType, contentUrl, description }], { session })
        
            await session.commitTransaction();
            session.endSession();

            res.status(201).json({
                success: true,
                message: "Post created successfully",
                data: newPost[0],
            })
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            next(error)
        }
    });
}

export const createImagePost = async (req, res, next) => {
    const session = await mongoose.startSession();
        session.startTransaction();
    
        
        try{
        const { userId, contentType, content, description } = req.body;
    
        if(!userId || !contentType || !content) {
            const error = new Error("Missing required fields: userId, contentType or content");
            error.statusCode = 400;
            throw error;
        }

        const newPost = await Post.create([{ id: uuidv4(), userId, contentType, content, description }], { session })

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: "Post successuflly created",
            data: newPost[0]
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error)
    }

}

export const deletePost = async (req, res, next) => {
        try{
            const post = await Post.findById(req.params.id);

            if(!post){
             return res.status(404).json({ message: "Post not found" })
            }    

            if(post.userId.toString() !== req.user._id.toString()){
                return res.stauts(403).json({ message: "You can't delete this post" })
            }
            
            await post.delete()
            
            res.status(200).json({ message: "Post deleted successfully"})
    } catch (error) {
        next(error)
    }
}

export const likePost = async (req, res, next) => {
    try{
        const user = await User.findById(req.user._id)
        if(!user){
            return res.status(404).json({ message: "User not found" })
        }

        const postId = req.params.id

        if(user.likedContent.includes(postId)){
            user.likedContent.pull(postId);
            await user.save();
            return res.status(200).json({ message: "Content successfully unliked" })
        }
        
        user.likedContent.push(postId);
        await user.save();

        return res.status(200).json({ message: "Content successfully liked" })
    } catch(error) {
        next(error)
    }
}

export const post = async (req, res, next) => {}