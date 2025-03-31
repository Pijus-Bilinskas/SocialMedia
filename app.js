import express from "express";

import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import connectToDatabase from "./database/mongodb.js";
import postRouter from "./routes/post.routes.js";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/post', postRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/chat', chatRouter)


app.use(errorMiddleware)

app.get("/", (req, res) => {
    res.send("Welcome to the Social media backend")
})

app.listen(PORT, async () => {
    console.log(`Social media API is running on http://localhost:${PORT}`)

    await connectToDatabase();
})

console.log("App running on localhost:5000")
