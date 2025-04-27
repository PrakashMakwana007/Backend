import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import mongoose, { Query } from "mongoose"


const getchanelStat  = asyncHandler(async(req,res)=>{
     const {chanelId} = req.params
     
     if(!chanelId){
          throw new ApiError(400,"invald chanelid")
     }

     if(!mongoose.Types.ObjectId.isValid(chanelId)){
        throw new ApiError(400,"invald chanelid")
     }

     // aggrragt chanel  start 
   
     const videostats = await Video.aggregate([
        {$match :{
           owner : new mongoose.Types.ObjectId(chanelId) 
         }
       },
       {
        $group :{
            _id : null,
            totalViews :{$sum : "$views"},
            totalVideos:{$sum : 1}
        }
       }
      ])
       
    const totalSuscriber = await Subscription.countDocuments({chanel :chanelId})

    const totalLike = await Like.countDocuments({ video: { $in: videostats.map(v => v._id) }})


    const stats = videostats.length >0 ? videostats[0]:{
        totalViews :0 ,
        totalVideos : 0
    } 

    return res.status(200).json(
        new ApiResponse (200,{
            totalVideos: stats.totalVideos,
            totalViews: stats.totalViews,
            totalSuscriber,
            totalLike,},
                "success ok "
        )
    )
     
})

const getChanelVideo = asyncHandler(async(req,res)=>{
    const {chanelId} = req.params

    if(!chanelId){
        throw new ApiError(400,"chanelId is invalid")
    }

    if(!mongoose.Types.ObjectId.isValid(chanelId)){
        throw new ApiError(400 , "chanel  id  is invalid ")
    }

     const video  =await Video.find({owner : chanelId}).sort({createdAt: -1})
        
     
     if(!video.length){
        throw new ApiError(400,"video  is  not found")
     }

     return res.status(200).json(
        new ApiResponse(200,video,"ok success for stats")
     )
 })
export {
     getchanelStat,
     getChanelVideo
}