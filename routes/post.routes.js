import { Router } from "express";
import { createPost, createImagePost, userPosts, userPost, deletePost, likePost } from "../controllers/post.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const postRouter = Router();

postRouter.get("/:id/posts", userPosts);
postRouter.get("/:id", userPost);

postRouter.post("/createPost", authorize, createPost);
postRouter.post("/create-image-post", authorize, createImagePost);
postRouter.post("/like/:id", authorize, likePost);

postRouter.delete("/delete/:id", authorize, deletePost);

export default postRouter;