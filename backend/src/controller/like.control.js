import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/coment.model.js"; 


const videoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    if (!userId) {
        throw new ApiError(400, "Invalid user ID");
    }

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

    if (existingLike) {
        const disliked = await Like.findByIdAndDelete(existingLike._id);
        if (!disliked) {
            throw new ApiError(400, "Error disliking video");
        }
        const likeCount = await Like.countDocuments({ video: videoId });
        return res.status(200).json(new ApiResponse(200, { isLiked: false, likeCount }, "Video disliked"));
    } else {
        const liked = await Like.create({ video: videoId, likedBy: userId });
        if (!liked) {
            throw new ApiError(400, "Error liking video");
        }
        const likeCount = await Like.countDocuments({ video: videoId });
        return res.status(200).json(new ApiResponse(200, { isLiked: true, likeCount }, "Video liked successfully"));
    }
});
const commentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?._id;
     console.log("comeent  and  userid",userId, commentId)
    if (!userId) {
        throw new ApiError(400, "User ID is invalid");
    }
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Comment ID is invalid");
    }

    const commentExists = await Comment.findById(commentId);
    if (!commentExists) {
        throw new ApiError(404, "Comment not found");
    }

    const existingLike = await Like.findOne({ comment: commentId, likedBy: userId });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, false, "Comment disliked"));
    } else {
        const likeComment = await Like.create({ comment: commentId, likedBy: userId });
        return res.status(200).json(new ApiResponse(200, true, "Comment liked"));
    }
});

const getLikedvideo = asyncHandler(async (req, res) => {
    
        const userId = req.user._id;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "User ID is invalid");
        }
    
        // ✅ Fetch only likes where "video" field exists (ignores comment likes)
        const likedVideos = await Like.find({
            likedBy: userId,
            video: { $exists: true } // ✅ Ensures only video likes are retrieved
        }).populate({
            path: "video",
            select: "title description thumbnail views createdAt duration ",
        });
    
        if (!likedVideos.length) {
            throw new ApiError(400, "No liked videos found");
        }
    
        return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos retrieved"));
    });
    

    const getlikeStatus = asyncHandler(async(req,res)=>{
        const { videoId } = req.params;
        const userId = req.user._id;
      
        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
          throw new ApiError(400, "Invalid video ID");
        }
      
        // Check if user liked the video
        const isLiked = await Like.exists({ video: videoId, likedBy: userId });
      
        // Get total likes for the video
        const likeCount = await Like.countDocuments({ video: videoId });
      
        return res.status(200).json(
          new ApiResponse(200, { isLiked: !!isLiked, likeCount }, "Like status fetched")
        );
    })

export { videoLike, commentLike, getLikedvideo , getlikeStatus };
