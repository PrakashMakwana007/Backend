import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch Channel Statistics
export const fetchChannelStats = createAsyncThunk(
  "dashboard/fetchChannelStats",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/dashboard/stats/${channelId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch Channel Videos
export const fetchChannelVideos = createAsyncThunk(
  "dashboard/fetchChannelVideos",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/dashboard/videos/${channelId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: {},
    videos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChannelStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchChannelStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChannelVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChannelVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchChannelVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
