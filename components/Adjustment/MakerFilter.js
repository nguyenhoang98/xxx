import { useState } from 'react';
import { Button, Col, Form, Row, Select, Upload, Space } from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  SelectOutlined
} from '@ant-design/icons';
import { useInterval } from 'utils/useInterval';
import reportApi from 'api/reportApi';

const { Option } = Select;

export default function MakerFilter({
  loading,
  reloadFlag,
  setReloadFlag,
  setLoading,
  exportExcel,
  statusAdjustment
}) {
  const [fileList, setFileUpload] = useState([]);
  const [progressPercent, setProgressPercent] = useState(null);

  const exportTemplateApi = `adjustment-request-revenue/files/templates`;
  const propsUpload = {
    beforeUpload: file => {
      setFileUpload([file]);
      return false;
    },
    fileList,
    accept: '.xls,.xlsx'
  };

  const progressUploadFile = async () => {
    if (progressPercent === null) return;
    const { data } = await reportApi.getPercentageOfProcessUploadFileForMaker();
    setProgressPercent(data);
  };

  const uploadFile = () => {
    const formData = new FormData();
    formData.append('file', fileList[0]);
    reportApi.uploadAdjustmentRequestRevenueForMaker(formData).then(() => {
      setLoading(true);
      setProgressPercent(0);
    });
  };

  const checkInterval = () => {
    if (progressPercent === 100) {
      setProgressPercent(null);
      setLoading(false);
      setReloadFlag(!reloadFlag);
      setFileUpload([]);
      return null;
    }
    return 2000;
  };

  useInterval(() => {
    progressUploadFile();
  }, checkInterval());

  return (
    <Form>
      <Row gutter={[12, 0]}>
        <Col span={9}>
          <Form.Item>
            <Select
              placeholder="Chọn loại báo cáo điều chỉnh"
              defaultActiveFirstOption
              defaultValue="Doanh thu"
            >
              <Option>Doanh thu</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item name="file">
            <Upload {...propsUpload}>
              <Button icon={<SelectOutlined />}>Select adjustment file</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={6} className="flex items-start justify-end">
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => exportExcel(exportTemplateApi)}
            >
              Tải file mẫu
            </Button>
            <Button
              icon={<UploadOutlined />}
              onClick={uploadFile}
              type="primary"
              disabled={statusAdjustment.requestStatus === 'PENDING'}
            >
              {loading ? 'Uploading' : 'Start Upload'}
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
}
