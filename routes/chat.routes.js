import authorize  from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { personalMessageCreate, personalMessageDelete, personalMessages } from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.get("/messages", authorize, personalMessages)

chatRouter.post("/message", authorize, personalMessageCreate);

chatRouter.delete("/message/:id", authorize, personalMessageDelete);

export default chatRouter;