import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utility/baseUrl';


const commentApi = createApi({
    reducerPath: "commentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/comments`,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token || localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Comments', 'Blogs'],
    endpoints: (builder) => ({
        postComment: builder.mutation({
            query: (commentData) => ({
                url: "/post-comments",
                method: "POST",
                body: commentData
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: 'Blogs', id: postId },
                'Comments'
            ]
        }),
        updateComment: builder.mutation({
            query: ({ id, comment }) => ({
                url: `/${id}`,
                method: "PUT",
                body: { comment }
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: 'Blogs', id: postId },
                'Comments'
            ]
        }),
        deleteComment: builder.mutation({
            query: ({ id, postId }) => ({
                url: `/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: 'Blogs', id: postId },
                'Comments'
            ]
        }),
        getComment: builder.query({
            query: () => ({
                url: "/total-comment",
                method: "GET"
            }),
            providesTags: ['Comments']
        })
    })
})

export const { 
    useGetCommentQuery, 
    usePostCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation
} = commentApi;

export default commentApi;