import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const fetchOffers = async () => {
  const response = await axiosInstance.get('offers?active=true');
  return response.data;
};

const fetchOffersByVendor = async (vendorId) => {
  const response = await axiosInstance.get(`offers/vendors/${vendorId}`);
  return response.data;
};

const fetchOffersByUser = async (userId) => {
  const response = await axiosInstance.get(`offers/users/${userId}`);
  return response.data;
};

const fetchOfferById = async (offerId) => {
  const response = await axiosInstance.get(`offers/${offerId}`);
  return response.data;
};

const saveOrRedeemOffer = async ({ data }) => {
  const response = await axiosInstance.post(`user_offers`, data);
  return response.data;
};

const deleteUserOffer = async (userOfferId) => {
  await axiosInstance.delete(`user_offers/${userOfferId}`);
  return userOfferId;
};

export const useOffers = () => {
  return useQuery({
    queryKey: ['offers'],
    queryFn: fetchOffers,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });
};

export const useOfferById = (offerId) => {
  return useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => fetchOfferById(offerId),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });
};

export const useOffersByVendor = (vendorId) => {
  return useQuery({
    queryKey: ['offers', vendorId],
    queryFn: () => fetchOffersByVendor(vendorId),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });
};

export const useOffersByUser = (userId) => {
  return useQuery({
    queryKey: ['myOffers', userId],
    queryFn: () => fetchOffersByUser(userId),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });
};

export const useSaveOrRedeemOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveOrRedeemOffer,
    onSuccess: () => {
      queryClient.invalidateQueries(['offers']);
      queryClient.invalidateQueries(['offer']);
    },
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserOffer,
    onSuccess: () => {
      queryClient.invalidateQueries(['offers']);
      queryClient.invalidateQueries(['offer']);
    },
  });
};
