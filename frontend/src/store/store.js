import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import videoReducer from './videoSlice';
import playlistReducer from "./palylistSlice"
import subscriptionReducer from "./subscriptionSlice"
import dashbordReducer from "./dashbordSlice"
import likeReducer from "./likeSlice"
const store = configureStore({
    reducer: {
        user: userReducer,
        video: videoReducer,
        playlist: playlistReducer,
        subscription: subscriptionReducer,
        dashbord : dashbordReducer,
        like : likeReducer
    },
});

export default store;