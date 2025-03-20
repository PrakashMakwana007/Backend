import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Toggle Video Like
export const toggleVideoLike = createAsyncThunk("like/toggleVideoLike", async (videoId, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/api/likes/video/${videoId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Toggle Comment Like
export const toggleCommentLike = createAsyncThunk("like/toggleCommentLike", async (commentId, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/api/likes/comment/${commentId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Fetch Liked Videos
export const fetchLikedVideos = createAsyncThunk("like/fetchLikedVideos", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("/api/likes/videos");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const likeSlice = createSlice({
    name: "like",
    initialState: {
        likedVideos: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(toggleVideoLike.fulfilled, (state, action) => {
                // Handle toggling logic
            })
            .addCase(toggleCommentLike.fulfilled, (state, action) => {
                // Handle toggling logic
            })
            .addCase(fetchLikedVideos.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLikedVideos.fulfilled, (state, action) => {
                state.loading = false;
                state.likedVideos = action.payload;
            })
            .addCase(fetchLikedVideos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default likeSlice.reducer;
