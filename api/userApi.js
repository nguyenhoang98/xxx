import axiosClient from './axiosClient';

const userApi = {
  getUserInfoByToken: () => {
    return axiosClient.get(`/api/v1/users/information`);
  }
};

export default userApi;
