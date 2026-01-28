import User from '../models/User';

export const fetchAllUsers = async () => {
    return await User.find().select('-__v');
};

export const fetchUserById = async (id: string) => {
    return await User.findById(id).select('-__v');
};

export const modifyUser = async (id: string, data: { name?: string; email?: string }) => {
    return await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).select('-__v');
};

export const removeUser = async (id: string) => {
    return await User.findByIdAndDelete(id);
};
