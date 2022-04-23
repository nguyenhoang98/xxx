import { Space, Button } from 'antd';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';

export function ListingFormActions({ onResetForm, disabled = false }) {
  return (
    <Space className="flex justify-end">
      <Button
        icon={<SyncOutlined />}
        htmlType="button"
        onClick={onResetForm}
        disabled={disabled}
      >
        Reset
      </Button>
      <Button
        type="primary"
        icon={<SearchOutlined />}
        style={{ width: '7.5rem' }}
        htmlType="submit"
        disabled={disabled}
      >
        Tìm kiếm
      </Button>
    </Space>
  );
}
