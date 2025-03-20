import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch all videos
export const fetchVideos = createAsyncThunk(
  "video/fetchVideos",
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/videos", { params: queryParams });
      return response.data; // Ensure the API response is correctly structured
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch videos");
    }
  }
);

// ✅ Fetch video by ID
export const fetchVideoById = createAsyncThunk(
  "video/fetchVideoById",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/videos/${videoId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch video");
    }
  }
);

// ✅ Upload a new video
export const uploadVideo = createAsyncThunk(
  "video/uploadVideo",
  async (videoData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/videos", videoData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to upload video");
    }
  }
);

// ✅ Update video details
export const updateVideo = createAsyncThunk(
  "video/updateVideo",
  async ({ videoId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/videos/${videoId}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update video");
    }
  }
);

// ✅ Delete a video
export const deleteVideo = createAsyncThunk(
  "video/deleteVideo",
  async (videoId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/videos/${videoId}`);
      return videoId; // ✅ Return videoId instead of action.payload._id
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete video");
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState: {
    videos: [],
    currentVideo: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload; // ✅ Use `action.payload`
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.currentVideo = action.payload;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.videos.push(action.payload);
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.videos = state.videos.map((video) =>
          video._id === action.payload._id ? action.payload : video
        );
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter((video) => video._id !== action.payload); // ✅ Use action.payload directly
      });
  },
});

export default videoSlice.reducer;
