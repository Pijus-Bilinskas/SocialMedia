import { Router } from "express";
import { createPost, createImagePost, userPosts, userPost } from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.get("/:id/posts", userPosts);
postRouter.get("/:id", userPost);

postRouter.post("/createPost", createPost);
postRouter.post("/create-image-post", createImagePost);

export default postRouter;