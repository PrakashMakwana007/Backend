import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";



const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const user = req.user?._id;

    if (!user) {
        throw new ApiError(400, "Please login. User not found.");
    }
    if (!name || !description) {
        throw new ApiError(400, "Name and description are required.");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: user
    });

    return res.status(201).json(
        new ApiResponse(201, playlist, "Playlist created successfully.")
    );
});


const getUserPlaylist = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID.");
    }

    const playlists = await Playlist.find({ owner: userId });

    if (!playlists.length) {
        throw new ApiError(404, "No playlists found for this user.");
    }

    return res.status(200).json(
        new ApiResponse(200, playlists, "User playlists retrieved successfully.")
    );
});


const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID.");
    }

    const playlist = await Playlist.findById(playlistId).populate("videos");

    if (!playlist) {
        throw new ApiError(404, "Playlist does not exist.");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist retrieved successfully.")
    );
});


const addVideo = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID.");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found.");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video is already in the playlist.");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist successfully.")
    );
});


const removeVideo = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID.");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found.");
    }

    const videoIndex = playlist.videos.indexOf(videoId);
    if (videoIndex === -1) {
        throw new ApiError(400, "Video not found in the playlist.");
    }

    playlist.videos.splice(videoIndex, 1);
    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video removed from playlist successfully.")
    );
});


const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    
    const playlistids = mongoose.Types.ObjectId.isValid(playlistId)
    if(!playlistids){
        throw new ApiError(400 ,"invalid playlist id")
    }

    if(!name || description ){
        throw new ApiError(400 ,"name and description is reqired ")

    }
    
   const playlist =await  Playlist.findById(playlistId)
   if(!playlist){
    throw new ApiError(400 ,"invalid playlist ")
   }

   if(name || description){
    playlist.name=name,
    playlist.description = description
   }

   await playlist.save()

   return res.status(200).json(
    new ApiResponse(
        200 ,playlist,
        "ok"
    )
   )
})


const deletePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params

    const playlistids= mongoose.Types.ObjectId.isValid(playlistId)
    if(!playlistids){
        throw new ApiError(400 ,"invalid  playlist id")
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)
    if(!playlist){
        throw new ApiError(400 ,"invalid  playlist")
    }

    return res.status(200).json(new ApiResponse(
        200,null,"ok "
    ))
})






export {
    createPlaylist,
    getUserPlaylist,
    getPlaylistById,
    addVideo,
    removeVideo,
    updatePlaylist,
    deletePlaylist
};
