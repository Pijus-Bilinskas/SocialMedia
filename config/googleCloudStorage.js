import dotenv from "dotenv";
import { Storage } from "@google-cloud/storage";

dotenv.config();

const storage = new Storage({
    keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

export { storage, bucket };