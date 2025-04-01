import User from "../models/user.model.js"

export const getUsers = async (req, res, next) => {
    try{
        const users = await User.find();

        res.status(200).json({ success: true, data: users })
    }catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try{
        console.log(req.params.id)
        const user = await User.findOne({ id: req.params.id }).select('-password');

        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error
        }

        res.status(200).json({ success: true, data: user })
    }catch (error) {
        next(error)
    }
}

export const updateUserProfile = async (req, res, next) => {
    try{
        const { userId } = req.params;
        const updates = {...req.body};
        

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
        }).select('-password')

        if(!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        res.status(200).json({ success: true, data: updatedUser })
    }catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    try{
        // add logic for deleting user, perhaps admin only

    } catch (error) {
        next(error)
    }
}
