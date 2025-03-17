import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, "Id is required"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "User Name is required"],
        trim: true,
        minLength: 2,
        maxLength: 55,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "User Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email adress'],
    },
    password: {
        type: String,
        required: [true, "User password is required"],
        minLength: 6,
    },
    followers: {
        type: Array,
    }
}, {timestamps: true});
//timestamps will auto add createdAt and updated fields to the Schema

const User = mongoose.model("User", userSchema)
export default User;