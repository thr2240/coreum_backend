import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require: true,
        min: 3,
        max: 15,
    },
    lastname: {
        type: String,
        require: true,
        min: 3,
        max: 15,
    },
    username: {
        type: String,
        require: true
    },
    wallet: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        max: 50,
    },
    bio: {
        type: String,
        default: ""
    },
    photo: {
        type: String,
        default: ""
    },
    cover: {
        type: String,
        default: ""
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

export default mongoose.model("User", UserSchema);