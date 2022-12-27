import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {   
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            index: {
                unique: true,
            }
        },
        password: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', userSchema);