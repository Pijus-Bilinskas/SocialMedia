import { config } from "dotenv";

config({path: `.env.${process.env.NODE_ENV || "development"}.local`});

export const { PORT, SERVER_URL, JWT_SECRET,
                 JWT_EXPIRES_IN, NODE_ENV, DB_URI,
                  EMAIL_USER, EMAIL_PASSWORD, FRONTEND_URL} = process.env
