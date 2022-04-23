import { Result, Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useAuth } from 'contexts/auth-context';

export default function UnauthenticatedApp() {
  const { logout } = useAuth();

  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, bạn không có quyền truy cập hệ thống."
      extra={
        <Button type="primary" icon={<LoginOutlined />} onClick={logout}>
          Đăng Nhập
        </Button>
      }
    />
  );
}
