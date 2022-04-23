import 'styles/antd-custom.less';
import 'styles/globals.less';
import 'styles/tailwind.less';

import Head from 'next/head';
import { AuthProvider, ProtectedRoute } from 'contexts/auth-context';
import { ConfigProvider, message } from 'antd';
import { SWRConfig } from 'swr';
import { Provider } from 'react-redux';
import store from 'store';
import AppLayout from 'components/AppLayout';
import axiosClient from 'api/axiosClient';

function App({ Component, pageProps }) {
  const antPrefix = 'ivnd';
  message.config({
    prefixCls: 'ivnd-message'
  });

  const fetcher = url => axiosClient.get(url).then(res => res.data);

  return (
    <ConfigProvider prefixCls={antPrefix}>
      <AuthProvider>
        <ProtectedRoute>
          <Provider store={store}>
            <Head>
              <title>Product Management System</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <SWRConfig value={{ fetcher }}>
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            </SWRConfig>
          </Provider>
        </ProtectedRoute>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
