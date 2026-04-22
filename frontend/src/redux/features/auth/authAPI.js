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


export const { useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation, useGetUsersQuery,
    useDeleteUserMutation, useUpdateUserRoleMutation } = authApi;

export default authApi;