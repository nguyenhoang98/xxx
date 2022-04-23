import useSWR from 'swr';
import queryString from 'query-string';
import axiosClient from './axiosClient';

const policyApi = {
  getSearchPolicyByBeneficiary: params => {
    return useSWR(
      params
        ? `/api/v1/staff-policies/view-by-beneficiary?${queryString.stringify(
            params
          )}`
        : null
    );
  },

  getPolicyById: id => {
    return useSWR(id ? `api/v1/staff-policies/${id}` : null);
  },

  approvalPolicyById: id => {
    return axiosClient.put(`/api/v1/staff-policies/${id}/approval`);
  },

  deletePolicyById: id => {
    return axiosClient.delete(`api/v1/staff-policies/${id}`);
  },

  deactivatePolicyById: id => {
    return axiosClient.put(`/api/v1/staff-policies/${id}/deactivation`);
  },

  getAllPolicyStatuses: () => {
    return useSWR(`/api/v1/staff-policies/statuses/all`);
  },

  getAllPolicyTypes: () => {
    return useSWR(`/api/v1/staff-policies/types/all`);
  },

  searchBeneficiaries: params => {
    return useSWR(
      params
        ? `/api/v1/staff-beneficiaries?${queryString.stringify(params)}`
        : null
    );
  },

  getAllBeneficiaryRoles: () => {
    return useSWR(`/api/v1/staff-beneficiaries/roles/all`);
  },

  getAllBeneficiaryJobDescriptions: () => {
    return useSWR(`/api/v1/staff-beneficiaries/job-descriptions/all`);
  },

  getAllBeneficiaryTitles: () => {
    return useSWR(`/api/v1/staff-beneficiaries/titles/all`);
  },

  getAllBeneficiaryPos: () => {
    return useSWR(`/api/v1/staff-beneficiaries/pos/all`);
  },

  getAllBeneficiaryCertificates: () => {
    return useSWR(`/api/v1/staff-beneficiaries/certificates/all`);
  },

  createBeneficiary: payload => {
    return axiosClient.post(`/api/v1/staff-beneficiaries`, payload);
  },

  searchProducts: params => {
    return useSWR(
      params
        ? `/api/v1/products/activation?${queryString.stringify(params)}`
        : null
    );
  },

  getAllCalculationCycles: () => {
    return useSWR(`/api/v1/terms/calculation-cycles/all`);
  },

  getAllClosingTimes: () => {
    return useSWR(`/api/v1/terms/closing-times/all`);
  },

  getAllBeneficialValueFactors: () => {
    return useSWR(`/api/v1/factors/all`);
  },

  getAllOperators: () => {
    return useSWR(`/api/v1/operators/all`);
  },

  getAllPolicyRankTypes: () => {
    return useSWR(`/api/v1/staff-policies/rank-types/all`);
  },

  getAllPolicyRankValueTypes: () => {
    return useSWR(`/api/v1/staff-policies/rank-value-types/all`);
  },

  createPolicy: payload => {
    return axiosClient.post(`/api/v1/staff-policies`, payload);
  }
};

export default policyApi;
