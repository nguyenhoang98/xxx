/* eslint-disable no-console */
const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_SERVER
} = require('next/constants');
const nextConfigModule = require('./next.config.js');

let nextConfig;
if (typeof nextConfigModule === 'function') {
  nextConfig = nextConfigModule(
    dev ? PHASE_DEVELOPMENT_SERVER : PHASE_PRODUCTION_SERVER,
    {}
  );
} else {
  nextConfig = nextConfigModule;
}

const apiGateway = nextConfig.env.REACT_APP_API_URL;
const apiGatewayDor = nextConfig.env.REACT_APP_DOR_URL;
const port = nextConfig.env.REACT_APP_PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

const options = {
  target: `${apiGateway}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api/': ''
  }
};
const optionsDor = {
  target: `${apiGatewayDor}`,
  changeOrigin: true,
  pathRewrite: {
    '^/dor/': ''
  }
};

app
  .prepare()
  .then(() => {
    const server = express();

    server.use('/api', createProxyMiddleware(options));
    server.use('/dor', createProxyMiddleware(optionsDor));

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.log('Error:::::', err);
  });
