/* eslint-disable */
const withLess = require("@zeit/next-less");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const getEnvVariables = (phase) => {
  let env;

  env = {
    REACT_APP_PORT: 3000,
    // REACT_APP_API_URL: 'http://10.40.16.94:9091',
    // REACT_APP_API_URL: 'http://10.40.28.152:9091',
    REACT_APP_API_URL: "http://10.26.53.223:9091",
    // REACT_APP_API_URL: 'http://localhost:9091',
    REACT_APP_VND_LOGIN_DOMAIN: "https://id-uat.vndirect.com.vn",
    // REACT_APP_DOR_URL: 'http://10.40.28.204:8080'
    REACT_APP_DOR_URL: "http://10.200.39.91:8080",
  };

  if (process.env.ENV === "uat") {
    env = {
      REACT_APP_PORT: 3000,
      REACT_APP_API_URL: "http://10.26.53.223:9091",
      REACT_APP_VND_LOGIN_DOMAIN: "https://id-uat.vndirect.com.vn",
      REACT_APP_DOR_URL: "http://10.200.39.91:8080",
    };
  }

  if (process.env.ENV === "production") {
    env = {
      REACT_APP_PORT: 3000,
      REACT_APP_API_URL: "https://pms-api.vndirect.com.vn",
      REACT_APP_VND_LOGIN_DOMAIN: "https://id.vndirect.com.vn",
      REACT_APP_DOR_URL: "https://dor-stagging.vndirect.com.vn",
    };
  }

  const publicRuntimeConfig = { ...env };

  return { env, publicRuntimeConfig };
};

const nextConfig = getEnvVariables();

module.exports = withBundleAnalyzer(
  withLess({
    ...nextConfig,
    lessLoaderOptions: {
      javascriptEnabled: true,
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === "function") {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === "function" ? [] : origExternals),
        ];

        config.module.rules.unshift({
          test: antStyles,
          use: "null-loader",
        });
      }

      config.plugins.push(new AntdDayjsWebpackPlugin());
      return config;
    },
  })
);
