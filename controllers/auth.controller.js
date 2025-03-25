import mongoose from "mongoose"
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, FRONTEND_URL } from "../config/env.js";
import {v4 as uuidv4} from "uuid";
import sendEmail from "../config/nodemailer.js";


export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email })
        if(existingUser){
            const error = new Error("User already exists")
            error.statusCode = 409;
            throw error
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUsers = await User.create([{ id: uuidv4(), name, email, password: hashedPassword }], { session })

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })


        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUsers[0]
            }
        })
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error)
    }
}

export const signIn = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if(!user){
            const error = new Error("User not found")
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            const error = new Error("Invalid password")
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } )

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user
            }
        })
    }catch(error){
        next(error)
    }
}

export const signOut = async (req, res, next) => {
    //frontend could remove the jwt from cookies as a signout
}

export const requestPasswordReset = async (req, res, next) => {
    try{
        const { email } = req.body;
        const user = await User.findOne({ email })

        if(!user) {
            return res.status(404).json({ succcess: false, message: "User not found" })
        }

        const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "15m" })

        const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; text-align: center;">
                <h2>🔒 Reset Your Password</h2>
                <p>Click the button below to reset your password:</p>
                <a href="${resetLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>This link will expire in 15 minutes.</p>
            </div>
        `;

        await sendEmail(user.email, "Password Reset Request", emailHtml);
    
        res.status(200).json({ success: true, message: "Password reset email sent" });
    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const {token, newPassword} = req.body;

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId).session(session)

        if(!user){
            return res.status(400).json({ success: false, message: "Invalid or expired token" })
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt)

        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ succcess: true, message: "Password reset successful" })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error)
    }
}