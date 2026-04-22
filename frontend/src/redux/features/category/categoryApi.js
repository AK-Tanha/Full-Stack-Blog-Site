import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utility/baseUrl';

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        // Create category
        addCategory: builder.mutation({
            query: (newCategory) => ({
                url: '/categories/create-category',
                method: 'POST',
                body: newCategory,
            }),
            invalidatesTags: ['Category'],
        }),

        // Get all categories
        fetchCategories: builder.query({
            query: () => '/categories',
            providesTags: ['Category'],
        }),

        // Delete category
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useAddCategoryMutation,
    useFetchCategoriesQuery,
    useDeleteCategoryMutation,
} = categoryApi;
