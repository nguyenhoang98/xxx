import useSWR from 'swr';
import queryString from 'query-string';
import axiosClient from './axiosClient';

const reportApi = {
  getStagePeriodReport: params => {
    return useSWR(
      params ? `/dor/stage-period?${queryString.stringify(params)}` : null
    );
  },

  // maker
  getAdjustmentRequestRevenueDataForMaker: ({ page, pageSize }) => {
    return axiosClient.get(
      `/api/adjustment-request-revenue?page=${page}&size=${pageSize}&orderBy=status&direction=desc`
    );
  },

  confirmAdjustmentRequestRevenueForMaker: () => {
    return axiosClient.post(`/api/adjustment-request-revenue/confirmation`);
  },

  uploadAdjustmentRequestRevenueForMaker: file => {
    return axiosClient.post(`/api/adjustment-request-revenue/files`, file, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getPercentageOfProcessUploadFileForMaker: () => {
    return axiosClient.get(`/api/adjustment-request-revenue/files/percentages`);
  },

  // checker
  getAdjustmentRequestRevenueDataForChecker: ({ page, pageSize }) => {
    return axiosClient.get(
      `/api/adjustment-request-revenue/pending-data?page=${page}&size=${pageSize}`
    );
  },

  approveAdjustmentRequestRevenueForChecker: () => {
    return axiosClient.post(`/api/adjustment-request-revenue/approval`);
  },

  rejectAdjustmentRequestRevenueForChecker: file => {
    return axiosClient.post(`/api/adjustment-request-revenue/rejection`, file, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default reportApi;
