import axios from 'axios';
import queryString from 'query-string';
import getConfig from 'next/config';
import { message } from 'antd';

const { publicRuntimeConfig } = getConfig();

const vndLoginDomain = publicRuntimeConfig.REACT_APP_VND_LOGIN_DOMAIN;

const axiosClient = axios.create({
  baseURL: '/',
  paramsSerializer: params => queryString.stringify(params)
});

axiosClient.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem('token-id');

    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.common['token-id'] = token;
    }
    return config;
  },
  error => {
    throw error;
  }
);

axiosClient.interceptors.response.use(
  response => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }

    return Promise.reject(new Error(`Lỗi khi kết nối tới server! `));
  },
  error => {
    if (error.response?.status === 401) {
      window.localStorage.removeItem('token-id');
      window.location.href = `${vndLoginDomain}/logout?httpReferer=${window.location.href}`;
    }
    if (error.response?.data.errorMessage)
      message.error(error.response.data.errorMessage);
    throw error;
  }
);

export default axiosClient;
