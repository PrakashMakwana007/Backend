import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";



const videoLike = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const userId = req.user?._id

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400 ,"invalid  video id ")
    }
    if(!userId){
        throw new ApiError(400,"invalid userID")
    }

    const exitlike = await Like.findOne({video :videoId , likedBy : userId})


    if(exitlike){
         const dislike=  await Like.findByIdAndDelete(exitlike._id)
        if(!dislike){
        throw new ApiError(400,"video  is not  valid ")
        }
        return res.status(200).json(new ApiResponse (200,false,"video dislike"))
    }
    else{
         const liked = await Like.create({video:videoId , likedBy : userId})
         if(!liked){
         throw new ApiError(400 ,"error on liked video  ")
         }
        return res.status(200).json(new ApiResponse (200,true,"video liked success" ))
    }

})

const commentLike = asyncHandler(async(req ,res) =>{
     const  {commentId}= req.params
     const userId = req.user?._id

     if(!userId){
        throw new ApiError(400 ,"user id is invalid")
     }
     if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400 ,"comment id is invalid")
     }

     const exitLike = await Like.findOne({comment : commentId , likedBy : userId})

     if(exitLike){
        const dislikecomment = await Like.findByIdAndDelete(exitLike._id)
        if(!dislikecomment){
            throw new ApiError(400 ,"invalid  disklike comment id")
        } 
        return res.status(200).json(new ApiResponse(
            200,false,"comment dislike success"
        ))
     }
     else{
        const likecomment = await Like.create({comment : commentId , likedBy : userId})
        if(!likecomment){
            throw new ApiError(400 ,"invalid  like comment id")
        } 
        return res.status(200).json(new ApiResponse(
            200,true,"comment like success"
        ))
     }
}) 

const getLikedvideo = asyncHandler(async(req,res)=>{
      const userId = req.user._id
      
      if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new ApiError(400 ,"usrid is invalid")
      }

      const likedvideo = await Like.find({likedBy:userId}).
      populate({
        path: "video",
        select:"title  description thumbnail views createdAt"
      });
      if(!likedvideo.length){
        throw new ApiError(400,"the lekedvideo  is  not  found")
      }

      return res.status(200).json(new ApiResponse(200,likedvideo,"liked video is found "))
})
export {
    videoLike,
    commentLike,
    getLikedvideo
} 