import { useState, useEffect } from 'react';
import policyApi from 'api/policyApi';
import {
  Row,
  Col,
  Form,
  Typography,
  Button,
  Select,
  Tooltip,
  Radio,
  InputNumber
} from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { Group } = Radio;

export default function PolicyStepThreeRankValue({ form }) {
  const { rankConcernedValueFactor } = form.getFieldsValue();
  const [isRate, setIsRate] = useState(true);

  const {
    data: optionConcernedValues
  } = policyApi.getAllBeneficialValueFactors();
  const { data: optionRankTypes } = policyApi.getAllPolicyRankTypes();
  const { data: optionRankValueTypes } = policyApi.getAllPolicyRankValueTypes();

  useEffect(() => {
    if (rankConcernedValueFactor?.key === '' && optionConcernedValues) {
      form.setFieldsValue({
        rankConcernedValueFactor: {
          key: optionConcernedValues[0].id,
          value: optionConcernedValues[0].id,
          label: optionConcernedValues[0].name
        }
      });
    }
  }, [optionConcernedValues]);

  const setPreviousMaxRankValue = () => {
    const { ranks } = form.getFieldValue();
    return ranks.length > 0 ? ranks[ranks.length - 1].to : 0;
  };

  const onChangeRankValueType = e => {
    const { ranks } = form.getFieldValue();

    if (e.target.value === 'RATE') {
      setIsRate(true);
      ranks.forEach(item => {
        /* eslint no-param-reassign: ["error", { "props": false }] */
        item.fixed = 0;
      });
    } else {
      setIsRate(false);
      ranks.forEach(item => {
        /* eslint no-param-reassign: ["error", { "props": false }] */
        item.rate = 0;
      });
    }
  };

  const onChangeRankType = e => {
    form.setFieldsValue({
      rankTypeLabel: e.target.label
    });
  };

  return (
    <>
      <Title level={4} type="warning" className="mt-6">
        6. Set rank value
      </Title>
      <Row gutter={[12, 0]}>
        <Col span={12}>
          <Form.Item
            name="rankConcernedValueFactor"
            label="Concerned value"
            rules={[
              {
                required: true,
                message: 'Please select concerned value!'
              }
            ]}
          >
            <Select labelInValue className="w-full">
              {optionConcernedValues &&
                optionConcernedValues.map(({ id, name }) => (
                  <Option key={id} value={id}>
                    {name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="rankType">
            <Group onChange={onChangeRankType}>
              {optionRankTypes &&
                optionRankTypes.map(({ code, name }) => (
                  <Radio key={code} value={code} label={name}>
                    {name}
                  </Radio>
                ))}
            </Group>
          </Form.Item>
          <Form.Item name="rankTypeLabel" className="hidden" />
        </Col>
      </Row>
      <Row gutter={[12, 0]} className="leading-8">
        <Col span={7}>Min rank</Col>
        <Col span={7}>Max rank</Col>
        <div className="w-6" />
        <Col span={8}>
          <Form.Item name="rankValueType" className="mb-0">
            <Group className="w-full" onChange={onChangeRankValueType}>
              <Row gutter={[12, 0]}>
                {optionRankValueTypes &&
                  optionRankValueTypes.map(({ code, name }) => (
                    <Col key={code} span={12}>
                      <Radio key={code} value={code} label={name}>
                        {name}
                      </Radio>
                    </Col>
                  ))}
              </Row>
            </Group>
          </Form.Item>
        </Col>
      </Row>
      <Form.List name="ranks">
        {(fields, { add, remove }) => (
          <>
            {fields.map(field => (
              <Row key={field.key} gutter={[12, 0]}>
                <Col span={7}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'from']}
                    fieldKey={[field.fieldKey, 'from']}
                  >
                    <InputNumber
                      formatter={value =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'to']}
                    fieldKey={[field.fieldKey, 'to']}
                  >
                    <InputNumber
                      formatter={value =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <div className="w-6" />
                <Col span={4}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'rate']}
                    fieldKey={[field.fieldKey, 'rate']}
                  >
                    <InputNumber
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                      disabled={!isRate}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'fixed']}
                    fieldKey={[field.fieldKey, 'fixed']}
                  >
                    <InputNumber
                      formatter={value =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      disabled={isRate}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={1}>
                  <Tooltip title="Remove rank">
                    <Button
                      shape="circle"
                      size="small"
                      disabled={fields.length === 1}
                      icon={<MinusOutlined />}
                      onClick={() => remove(field.name)}
                      className="mt-1"
                    />
                  </Tooltip>
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() =>
                  add({
                    from: setPreviousMaxRankValue(),
                    to: null,
                    rate: 0,
                    fixed: 0
                  })}
                block
                icon={<PlusOutlined />}
                className="w-full"
              >
                Add rank
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}
