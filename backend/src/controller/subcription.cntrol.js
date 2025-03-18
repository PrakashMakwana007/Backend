import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";


const toogleSubcribe = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid Channel ID");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid User ID");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId, 
    });

    console.log("chanel id :" ,channelId)
    console.log("subscriber id :" ,userId)
    
    if (existingSubscription) {
        const deleted = await Subscription.findByIdAndDelete(existingSubscription._id);
        if (!deleted) {
            throw new ApiError(400, "Failed to unsubscribe. Subscription not found.");
        }
        return res.status(200).json(new ApiResponse(200, false, "Unsubscribed successfully"));
    } else {
        const newSubscription = await Subscription.create({
            subscriber: userId,
            channel: channelId, // ✅ Fixed typo from `chanel`
        });

        if (!newSubscription) {
            throw new ApiError(400, "Subscription failed");
        }

        return res.status(200).json(new ApiResponse(200, true, "Subscribed successfully"));
    }
});


const userChanelsubscribe = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid Channel ID");
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username email");

    if (!subscribers || subscribers.length === 0) {
        throw new ApiError(404, "No subscribers found");
    }

    return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers retrieved successfully"));
});


const getsubscribedChannel = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new ApiError(400, "Invalid Subscriber ID");
    }

    const list = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "username email"); 

    if (!list || list.length === 0) {
        throw new ApiError(404, "No subscriptions found for this user");
    }

    return res.status(200).json(new ApiResponse(200, list, "Subscribed channels retrieved successfully"));
});

export {
    toogleSubcribe,
    userChanelsubscribe,
    getsubscribedChannel
};
