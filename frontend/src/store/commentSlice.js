import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch Comments
export const fetchVideoComments = createAsyncThunk("comment/fetchVideoComments", async (videoId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/comments/${videoId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Add Comment
export const addComment = createAsyncThunk("comment/addComment", async ({ videoId, content }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/api/comments/${videoId}`, { content });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Update Comment
export const updateComment = createAsyncThunk("comment/updateComment", async ({ commentId, content }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/api/comments/${commentId}`, { content });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Delete Comment
export const deleteComment = createAsyncThunk("comment/deleteComment", async (commentId, { rejectWithValue }) => {
    try {
        await axios.delete(`/api/comments/${commentId}`);
        return commentId;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const commentSlice = createSlice({
    name: "comment",
    initialState: {
        comments: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVideoComments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchVideoComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
            })
            .addCase(fetchVideoComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.push(action.payload);
            })
            .addCase(updateComment.fulfilled, (state, action) => {
                state.comments = state.comments.map((comment) =>
                    comment._id === action.payload._id ? action.payload : comment
                );
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter((comment) => comment._id !== action.payload);
            });
    },
});

export default commentSlice.reducer;
