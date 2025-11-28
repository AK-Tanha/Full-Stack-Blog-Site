import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5001/api/',
    //baseUrl: 'https://backend-one-beta.vercel.app/api/',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    fetchBlogs: builder.query({
      query: ({ search = '', category = '', location = '' }) =>
        `blogs?search=${search}&category=${category}&location=${location}`,
    }),

    fetchBlogsByID: builder.query({
      query: (id) => `/blogs/${id}`
    }),

    fetchRelatedBlogs: builder.query({
      query: (id) => `/blogs/related/${id}`
    })
  }),
});

export const { useFetchBlogsQuery, useFetchBlogsByIDQuery, useFetchRelatedBlogsQuery } = blogApi;
