import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utility/baseUrl';

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/auth`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({

        registerUser: builder.mutation({
            query: (newUser) => ({
                url: "/register",
                method: "POST",
                body: newUser
            })
        }),

        loginUser: builder.mutation({
            query: (credentials) => ({
                url: "/log-in",
                method: "POST",
                body: credentials
            })
        }),

        logoutUser: builder.mutation({
            query: () => ({
                url: "/log-out",
                method: "POST",
            }),
        }),

        getUsers: builder.query({
            query: () => ({
                url: "/users",
                method: "GET",
            }),
            providesTags: ["user"]
        }),

        getUserProfile: builder.query({
            query: () => ({
                url: "/profile",
                method: "GET",
            }),
            providesTags: ["profile"]
        }),

        updateUserProfile: builder.mutation({
            query: (userData) => ({
                url: "/profile",
                method: "PUT",
                body: userData
            }),
            invalidatesTags: ["profile"]
        }),

        createUserByAdmin: builder.mutation({
            query: (userData) => ({
                url: "/users",
                method: "POST",
                body: userData
            }),
            invalidatesTags: ["user"]
        }),

        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["user"]
        }),

        updateUserByAdmin: builder.mutation({
            query: ({ userId, userData }) => ({
                url: `/users/${userId}`,
                method: "PUT",
                body: userData,
            }),
            invalidatesTags: ["user"]
        })



    })
})


export const { useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation, useGetUsersQuery,
    useGetUserProfileQuery, useUpdateUserProfileMutation, useCreateUserByAdminMutation,
    useDeleteUserMutation, useUpdateUserByAdminMutation } = authApi;

export default authApi;