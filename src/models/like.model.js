import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        comment: {
            type: mongoose.Types.ObjectId,
            ref: "Comment",
        },
        video: {
            type: mongoose.Types.ObjectId,
            ref: "Video",
            required: true,  
        },
        likedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,  
        },
    },
    {
        timestamps: true,
    }
);


likeSchema.index({ video: 1, likedBy: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);
