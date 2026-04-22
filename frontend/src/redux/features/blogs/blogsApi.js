import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utility/baseUrl';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Blogs'],
  endpoints: (builder) => ({
    fetchBlogs: builder.query({
      query: ({ search = '', category = '', location = '' }) =>
        `blogs?search=${search}&category=${category}&location=${location}`,
      providesTags: ['Blogs'],
    }),

    fetchBlogsByID: builder.query({
      query: (id) => `blogs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blogs', id }],
    }),

    fetchRelatedBlogs: builder.query({
      query: (id) => `blogs/related/${id}`,
    }),

    createBlog: builder.mutation({
      query: (newBlog) => ({
        url: 'blogs/create-post',
        method: 'POST',
        body: newBlog,
      }),
      invalidatesTags: ['Blogs'],
    }),

    updateBlog: builder.mutation({
      query: ({ id, ...updatedBlog }) => ({
        url: `blogs/update-post/${id}`,
        method: 'PATCH',
        body: updatedBlog,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Blogs', id }, 'Blogs'],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blogs'],
    }),

    uploadImage: builder.mutation({
      query: (formData) => ({
        url: 'upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { 
  useFetchBlogsQuery, 
  useFetchBlogsByIDQuery, 
  useFetchRelatedBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useUploadImageMutation
} = blogApi;
