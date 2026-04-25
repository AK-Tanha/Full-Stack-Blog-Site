import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utility/baseUrl';


export const adsApi = createApi({
    reducerPath: 'adsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/ads`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Ads'],
    endpoints: (builder) => ({
        fetchAds: builder.query({
            query: (params) => ({
                url: '/',
                params: params,
            }),
            providesTags: ['Ads'],
        }),
        fetchAdById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Ads', id }],
        }),
        createAd: builder.mutation({
            query: (newAd) => ({
                url: '/create-ad',
                method: 'POST',
                body: newAd,
            }),
            invalidatesTags: ['Ads'],
        }),
        updateAd: builder.mutation({
            query: ({ id, ...updatedAd }) => ({
                url: `/update-ad/${id}`,
                method: 'PATCH',
                body: updatedAd,
            }),
            invalidatesTags: (result, error, { id }) => ['Ads', { type: 'Ads', id }],
        }),
        deleteAd: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Ads'],
        }),
    }),
});

export const {
    useFetchAdsQuery,
    useFetchAdByIdQuery,
    useCreateAdMutation,
    useUpdateAdMutation,
    useDeleteAdMutation,
} = adsApi;
