import useSWR from 'swr';
import queryString from 'query-string';
import axiosClient from './axiosClient';

const productApi = {
  getSearchProduct: params => {
    return useSWR(
      params ? `/api/v1/products?${queryString.stringify(params)}` : null
    );
  },

  getSearchCategory: params => {
    return useSWR(
      params ? `/api/v1/categories?${queryString.stringify(params)}` : null
    );
  },

  createCategory: payload => {
    return axiosClient.post(`/api/v1/categories`, payload);
  },

  updateCategory: payload => {
    return axiosClient.put(`/api/v1/categories/${payload.id}`, payload);
  },

  getProductDetailById: id => {
    return useSWR(id ? `/api/v1/products/${id}` : null);
  },

  createProduct: payload => {
    return axiosClient.post(`/api/v1/products`, payload);
  },

  updateProduct: payload => {
    return axiosClient.put(`/api/v1/products/${payload.id}`, payload);
  },

  approveProductById: id => {
    return axiosClient.put(`/api/v1/products/${id}/approval`);
  },

  deleteProductById: id => {
    return axiosClient.delete(`/api/v1/products/${id}`);
  },

  deactivateProductById: id => {
    return axiosClient.put(`/api/v1/products/${id}/deactivation`);
  },

  rejectProductById: id => {
    return axiosClient.put(`/api/v1/products/${id}/rejection`);
  },

  getAllCategoryCreators: () => {
    return useSWR(`/api/v1/categories/creators/all?page=0&size=20`);
  },

  getAllCategoryStatuses: () => {
    return useSWR(`/api/v1/categories/statuses/all`);
  },

  getCategoryTree: () => {
    return useSWR(`/api/v1/categories/tree`);
  },

  getAllProductTypes: () => {
    return useSWR(`/api/v1/products/types/all`);
  },

  getAllProductStatuses: () => {
    return useSWR(`/api/v1/products/statuses/all`);
  }
};

export default productApi;
