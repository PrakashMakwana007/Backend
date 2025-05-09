import {Video} from "../models/video.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse  from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import {uploadOnCloudinary} from "../utils/cludeinary.js"
import asyncHandler from "../utils/asyncHandler.js"
import fs from "fs"
import { getVideoDurationInSeconds } from "get-video-duration";



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const videoMatch = {};
    if (query) {
        videoMatch.title = { $regex: query, $options: "i" };
    }

    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid user ID format");
        }
        videoMatch.owner = new mongoose.Types.ObjectId(userId);
    }

    const sort = {};
    sort[sortBy] = sortType === "desc" ? -1 : 1;

    const videos = await Video.aggregate([
        { $match: videoMatch },
        { $sort: sort },
        { $skip: (pageNumber - 1) * limitNumber },
        { $limit: limitNumber },

        // Join with user
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $unwind: "$ownerDetails"
        },

        // Join with likes
        {
            $lookup: {
                from: "likes",
                let: { videoId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$video", "$$videoId"] } } }
                ],
                as: "likes"
            }
        },

        // Join with comments
        {
            $lookup: {
                from: "comments",
                let: { videoId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$video", "$$videoId"] } } }
                ],
                as: "comments"
            }
        },

        // Project the required fields
        {
            $project: {
                title: 1,
                description: 1,
                views: 1,
                createdAt: 1,
                duration: 1,
                videoUrl: "$videoFile",
                thumbnail: 1,

                owner: "$ownerDetails._id",
                ownerName: "$ownerDetails.username",
                ownerAvatar: "$ownerDetails.avatar",

                likesCount: { $size: "$likes" },
                commentsCount: { $size: "$comments" }
            }
        }
    ]);

    if (!videos.length) {
        throw new ApiError(404, "Videos do not exist");
    }

    const totalVideo = await Video.countDocuments(videoMatch);

    return res.status(200).json(
        new ApiResponse(200, { videos, totalVideo, page: pageNumber, limit: limitNumber })
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!req.files || !req.files.videoFile || req.files.videoFile.length === 0) {
        throw new ApiError(400, "Video file is required");
    }

    const video = req.files.videoFile[0];

    const uploadedVideo = await uploadOnCloudinary(video.path, "video");
    if (!uploadedVideo) {
        throw new ApiError(400, "Video upload to Cloudinary failed");
    }

    let duration = 0;
    try {
        duration = await getVideoDurationInSeconds(video.path);
        console.log("Duration fetched:", duration);
    } catch (err) {
        console.error("Failed to get duration:", err);
    }

    if (fs.existsSync(video.path)) {
        fs.unlinkSync(video.path);
    }

    let thumbnailUrl = "";
    if (req.files.thumbnail && req.files.thumbnail.length > 0) {
        const thumbnail = req.files.thumbnail[0];
        const uploadedThumbnail = await uploadOnCloudinary(thumbnail.path, "image");
        if (!uploadedThumbnail) {
            throw new ApiError(400, "Thumbnail upload to Cloudinary failed");
        }
        thumbnailUrl = uploadedThumbnail.url;

        if (fs.existsSync(thumbnail.path)) {
            fs.unlinkSync(thumbnail.path);
        }
    }

    const newVideo = await Video.create({
        title,
        description,
        thumbnail: thumbnailUrl,
        videoFile: uploadedVideo.url,
        duration,
        owner: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, newVideo, "Video is published successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate and Convert videoId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }

    // Fetch the video by ID and increment the views count
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },
        { new: true } // To return the updated video
    ).populate("owner", "username avatar");

    // If video not found
    if (!updatedVideo) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video retrieved successfully")
    );
});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    console.log("videoid:",videoId)

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    let thumbnailUrl = video.thumbnail;
    if (req.file) {
        const uploadedThumbnail = await uploadOnCloudinary(req.file.path, "image");
        if (!uploadedThumbnail) {
            throw new ApiError(400, "Thumbnail upload to Cloudinary failed");
        }
        thumbnailUrl = uploadedThumbnail.url;
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }

    const updatedVideo = await Video.findOneAndUpdate(
        { _id: videoId },
        { title, description, thumbnail: thumbnailUrl },
        { new: true, runValidators: true }
    );

    if (!updatedVideo) {
        throw new ApiError(500, "Video update failed due to an internal error");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "The video has been updated successfully")
    );
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    

    const user = mongoose.Types.ObjectId.isValid(videoId)

    if(!user) {
        throw new ApiError(200 ,"the  video  is  not  found")
    } 

    const delateVideo = await Video.findByIdAndDelete(videoId)

    if(!delateVideo){
        throw new ApiError(200 ,"the  video is not  found")
    }

    return res.status(200).json(
        new ApiResponse(
            200 ,
            delateVideo,
            "the video  delate  success"
        )
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const user = mongoose.Types.ObjectId.isValid(videoId)

    if(!user){
        throw new ApiError(200,"the  videoid is not fatced ")
    }

    const video = await Video.findById(videoId)

    if(!video)
    {
        throw new ApiError(200,"the  video  is not fatced ")
    }

    video.isPublic = !video.isPublic

    await video.save()

    return res.status(200).json(
        new ApiResponse(200 , video ,
            ` the videos staus is  upadted ${video.isPublic? "Public" : "Privet"} `)
    )

})




export {
    getAllVideos ,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus

}