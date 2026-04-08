import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ConfigProvider, App as AntApp } from 'antd';

const antdTheme = {
  token: {
    colorPrimary: '#3643ba',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#e3262f',
    colorInfo: '#1890ff',
    colorBgContainer: '#ffffff',
    colorBorder: '#e1e0df',
    borderRadius: 8,
    fontFamily: 'Decathlon Text, sans-serif',
    fontSize: 16,
  },
};

export default function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  );
}
