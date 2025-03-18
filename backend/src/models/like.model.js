import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        comment: {
            type: mongoose.Types.ObjectId,
            ref: "Comment",
            required: function () { return !this.video; } // Required if video is not set
        },
        video: {
            type: mongoose.Types.ObjectId,
            ref: "Video",
            required: function () { return !this.comment; } // Required if comment is not set
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

likeSchema.index({ video: 1, likedBy: 1 }, { unique: true, sparse: true });
likeSchema.index({ comment: 1, likedBy: 1 }, { unique: true, sparse: true });

export const Like = mongoose.model("Like", likeSchema);
