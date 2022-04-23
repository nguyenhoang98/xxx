import axiosClient from './axiosClient';

const authApi = {
  logoutByToken: () => {
    return axiosClient.get(`/api/logout`);
  }
};

export default authApi;
