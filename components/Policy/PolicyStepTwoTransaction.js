import policyApi from 'api/policyApi';
import {
  Form,
  Typography,
  Button,
  Row,
  Col,
  Select,
  InputNumber,
  Tooltip
} from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

export default function PolicyStepTwoTransaction() {
  const { data: optionFactors } = policyApi.getAllBeneficialValueFactors();
  const { data: optionOperators } = policyApi.getAllOperators();

  return (
    <>
      <Title level={4} type="warning" className="mt-6">
        5. Transaction conditions
      </Title>
      <Row gutter={[12, 0]} className="leading-8">
        <Col span={10}>Factor</Col>
        <Col span={7}>Operator</Col>
        <Col span={5}>Value</Col>
      </Row>
      <Form.List name="conditions">
        {(fields, { add, remove }) => (
          <>
            {fields.map(field => (
              <Row key={field.key} gutter={[12, 0]}>
                <Col span={10}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'factor']}
                    fieldKey={[field.fieldKey, 'factor']}
                    rules={[
                      {
                        required: true,
                        message: 'Please select factor!'
                      }
                    ]}
                  >
                    <Select labelInValue className="w-full">
                      {optionFactors &&
                        optionFactors.map(({ id, name }) => (
                          <Option key={id} value={id}>
                            {name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'operator']}
                    fieldKey={[field.fieldKey, 'operator']}
                    rules={[
                      {
                        required: true,
                        message: 'Please select operator!'
                      }
                    ]}
                  >
                    <Select labelInValue className="w-full">
                      {optionOperators &&
                        optionOperators.map(({ id, name }) => (
                          <Option key={id} value={id}>
                            {name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'value']}
                    fieldKey={[field.fieldKey, 'value']}
                    rules={[
                      {
                        required: true,
                        message: 'Please input value!'
                      }
                    ]}
                  >
                    <InputNumber
                      formatter={value =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Tooltip title="Remove condition">
                    <Button
                      shape="circle"
                      size="small"
                      icon={<MinusOutlined />}
                      className="mt-1"
                      onClick={() => remove(field.name)}
                    />
                  </Tooltip>
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                className="w-full"
                onClick={() => add()}
              >
                Add condition
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}
