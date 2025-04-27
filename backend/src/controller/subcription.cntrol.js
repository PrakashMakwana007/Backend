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

    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId,
    });    

    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id);
        const subscriptionCount = await Subscription.countDocuments({ channel: channelId });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    subscribe: false,
                    subscriberCount: subscriptionCount
                },
                "Unsubscribed successfully"
            )
        );
    } else {
        try {
            await Subscription.create({
                subscriber: userId,
                channel: channelId,
            });
        } catch (error) {
            if (error.code === 11000) {
                throw new ApiError(400, "You are already subscribed to this channel");
            }
            throw error;
        }

        const subscriptionCount = await Subscription.countDocuments({ channel: channelId });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    subscribe: true,
                    subscriberCount: subscriptionCount
                },
                "Subscribed successfully"
            )
        );
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

    const subscriptionCount = await Subscription.countDocuments({ channel: channelId });

    return res.status(200).json(new ApiResponse(200, {
        subscribed: true,
        subscriptionCount: subscriptionCount
    }, "Subscribers retrieved successfully"));
});

const getsubscribedChannel = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new ApiError(400, "Invalid Subscriber ID");
    }

    const list = await Subscription.find({ subscriber: subscriberId })
    .populate("channel", "username email avatar description subscribersCount")


    if (!list || list.length === 0) {
        throw new ApiError(404, "No subscriptions found for this user");
    }
    const channelsWithSubscriberCount = list.map(sub => ({
        ...sub.channel._doc, // Include all the populated channel data
        subscribersCount: sub.channel.subscribersCount, // Add subscribersCount from the populated channel
    }));


    return res.status(200).json(new ApiResponse(200, channelsWithSubscriberCount, "Subscribed channels retrieved successfully"));
});

export {
    toogleSubcribe,
    userChanelsubscribe,
    getsubscribedChannel
};
