import { Col, Form, Input, Row, Select } from 'antd';

const { Option } = Select;

export default function CheckerFilter() {
  return (
    <Form layout="vertical">
      <Row gutter={[12, 0]}>
        <Col span={9}>
          <Form.Item label="Loại báo cáo điều chỉnh">
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
          <Form.Item label="User điều chỉnh" name="file">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Thời gian điều chỉnh gần nhất">
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
