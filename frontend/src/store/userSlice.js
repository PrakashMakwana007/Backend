import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.BASE_URL}/user/login`, userData, {
        withCredentials: true, 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to log in");
    }
  }
);


export const signupUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.BASE_URL}/user/register`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to register");
    }
  }
);


export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${import.meta.env.BASE_URL}/user/logout`, {}, { withCredentials: true });
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to log out");
    }
  }
);


export const getCurrentUser = createAsyncThunk(
  "user/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.BASE_URL}/user/getCurrentuser`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user data");
    }
  }
);



export const updateAvatar = createAsyncThunk(
  "user/updateAvatar",
  async (avatarFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await axios.put(`${import.meta.env.BASE_URL}/user/updateAvatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update avatar");
    }
  }
);
 

export const updateCoverImage = createAsyncThunk(
  "user/updateCoverImage",
  async (coverImageFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("coverImage", coverImageFile);

      const response = await axios.put(`${import.meta.env.BASE_URL}/user/updateCoverimage`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update cover image");
    }
  }
);


export const fetchWatchHistory = createAsyncThunk(
  "user/fetchWatchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.BASE_URL}/user/watchHistory`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch watch history");
    }
  }
);


export const fetchChannelProfile = createAsyncThunk(
  "user/fetchChannelProfile",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.BASE_URL}/user/chanel-profile`, { username });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch channel profile");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    watchHistory: [],
    channelProfile: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) state.user.avatar = action.payload.avatar;
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCoverImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCoverImage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) state.user.coverImage = action.payload.coverImage;
      })
      .addCase(updateCoverImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWatchHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWatchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.watchHistory = action.payload;
      })
      .addCase(fetchWatchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChannelProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChannelProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.channelProfile = action.payload;
      })
      .addCase(fetchChannelProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
