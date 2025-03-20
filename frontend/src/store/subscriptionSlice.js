import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch subscribed channels
export const fetchSubscribedChannels = createAsyncThunk(
  "subscription/fetchSubscribedChannels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/subscriptions");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch subscriptions");
    }
  }
);

// ✅ Fetch channel subscribers count
export const fetchChannelSubscribers = createAsyncThunk(
  "subscription/fetchChannelSubscribers",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/subscriptions/${channelId}/subscribers`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch channel subscribers");
    }
  }
);

// ✅ Toggle subscription (Subscribe/Unsubscribe)
export const toggleSubscription = createAsyncThunk(
  "subscription/toggleSubscription",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/subscriptions/toggle/${channelId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to toggle subscription");
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscriptions: [],
    subscribers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscribedChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscribedChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscribedChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChannelSubscribers.fulfilled, (state, action) => {
        state.subscribers = action.payload;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        // ✅ Update state dynamically based on subscription status
        const isSubscribed = state.subscriptions.some(
          (sub) => sub.channel._id === action.payload.channelId
        );

        if (isSubscribed) {
          state.subscriptions = state.subscriptions.filter(
            (sub) => sub.channel._id !== action.payload.channelId
          );
        } else {
          state.subscriptions.push(action.payload);
        }
      });
  },
});

export default subscriptionSlice.reducer;
