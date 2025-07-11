import { configureStore } from '@reduxjs/toolkit';
import { blogApi } from './features/blogs/blogsApi';
import authApi from './features/auth/authAPI';
import authReducer from "./features/auth/authSlice.js"
import commentApi from './features/comments/commentApi';

export const store = configureStore({
    reducer:{
       [ blogApi.reducerPath] : blogApi.reducer,
       [ authApi.reducerPath] : authApi.reducer,
       [ commentApi.reducerPath] : commentApi.reducer,
       auth : authReducer,
    },
     middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(blogApi.middleware, authApi.middleware, commentApi.middleware )
})