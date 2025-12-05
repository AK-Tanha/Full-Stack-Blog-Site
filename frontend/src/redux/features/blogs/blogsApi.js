import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({
    //baseUrl: 'http://localhost:5001/api/',
    baseUrl: 'https://full-stack-blog-site-ontq.vercel.app/api/',
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
      query: (id) => `/blogs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blogs', id }],
    }),

    fetchRelatedBlogs: builder.query({
      query: (id) => `/blogs/related/${id}`,
    }),

    createBlog: builder.mutation({
      query: (newBlog) => ({
        url: '/blogs/create-post',
        method: 'POST',
        body: newBlog,
      }),
      invalidatesTags: ['Blogs'],
    }),

    updateBlog: builder.mutation({
      query: ({ id, ...updatedBlog }) => ({
        url: `/blogs/update-post/${id}`,
        method: 'PATCH',
        body: updatedBlog,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Blogs', id }, 'Blogs'],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blogs'],
    }),
  }),
});

export const { 
  useFetchBlogsQuery, 
  useFetchBlogsByIDQuery, 
  useFetchRelatedBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation
} = blogApi;
