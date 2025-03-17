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
    
}

export const likePost = async (req, res, next) => {}

export const post = async (req, res, next) => {}