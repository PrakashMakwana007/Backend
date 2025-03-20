import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch user playlists
export const fetchUserPlaylists = createAsyncThunk('playlist/fetchUserPlaylists', async (userId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/playlists/user/${userId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Fetch playlist by ID
export const fetchPlaylistById = createAsyncThunk('playlist/fetchPlaylistById', async (playlistId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/playlists/${playlistId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Create a new playlist
export const createPlaylist = createAsyncThunk('playlist/createPlaylist', async (playlistData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/playlists', playlistData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Add video to playlist
export const addVideoToPlaylist = createAsyncThunk('playlist/addVideo', async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/api/playlists/${playlistId}/add/${videoId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Remove video from playlist
export const removeVideoFromPlaylist = createAsyncThunk('playlist/removeVideo', async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`/api/playlists/${playlistId}/remove/${videoId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Delete playlist
export const deletePlaylist = createAsyncThunk('playlist/deletePlaylist', async (playlistId, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`/api/playlists/${playlistId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const playlistSlice = createSlice({
    name: 'playlist',
    initialState: {
        playlists: [],
        currentPlaylist: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserPlaylists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
                state.loading = false;
                state.playlists = action.payload;
            })
            .addCase(fetchUserPlaylists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPlaylistById.fulfilled, (state, action) => {
                state.currentPlaylist = action.payload;
            })
            .addCase(createPlaylist.fulfilled, (state, action) => {
                state.playlists.push(action.payload);
            })
            .addCase(addVideoToPlaylist.fulfilled, (state, action) => {
                if (state.currentPlaylist && state.currentPlaylist._id === action.payload._id) {
                    state.currentPlaylist = action.payload;
                }
            })
            .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
                if (state.currentPlaylist && state.currentPlaylist._id === action.payload._id) {
                    state.currentPlaylist = action.payload;
                }
            })
            .addCase(deletePlaylist.fulfilled, (state, action) => {
                state.playlists = state.playlists.filter(playlist => playlist._id !== action.payload._id);
            });
    },
});

export default playlistSlice.reducer;
