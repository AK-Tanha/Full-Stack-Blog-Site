import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';



const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5001/api/auth",
        //baseUrl: "https://backend-one-beta.vercel.app/api/auth",
        credentials: "include"
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

        getUser: builder.mutation({
            query: () => ({
                url: "/users",
                method: "GET",
            }),
            reFetchOnMount: true,
            invalidatesTags: ["user"]
        }),

        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: "DELETE"
            }),
        }),

        UpdateUserRole: builder.mutation({
            query: ({ userId, role }) => ({
                url: `/users/${userId}`,
                method: "PUT",
                body: role,
            }),
            reFetchOnMount: true,
            invalidatesTags: ["user"]
        })



    })
})


export const { useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation, useGetUserMutation,
    useDeleteUserMutation, useUpdateUserRoleMutation } = authApi;

export default authApi;