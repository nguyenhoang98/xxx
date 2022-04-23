import { useEffect } from 'react';
import policyApi from 'api/policyApi';
import { Form, Typography, Input, Select, Row, Col, DatePicker } from 'antd';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function PolicyStepOneDefinition({ form }) {
  const { type, beneficialValueFactor } = form.getFieldsValue();
  const { data: optionTypes } = policyApi.getAllPolicyTypes();
  const {
    data: optionBeneficialValues
  } = policyApi.getAllBeneficialValueFactors();

  useEffect(() => {
    if (!type?.key && optionTypes) {
      form.setFieldsValue({
        type: {
          key: optionTypes[0].code,
          value: optionTypes[0].code,
          label: optionTypes[0].name
        }
      });
    }
  }, [optionTypes]);

  useEffect(() => {
    if (!beneficialValueFactor?.key && optionBeneficialValues) {
      form.setFieldsValue({
        beneficialValueFactor: {
          key: optionBeneficialValues[0].id,
          value: optionBeneficialValues[0].id,
          label: optionBeneficialValues[0].name
        }
      });
    }
  }, [optionBeneficialValues]);

  return (
    <>
      <Title level={4} type="warning">
        1. Policy definition
      </Title>
      <Row>
        <Col span={12}>
          <Form.Item
            name="type"
            label="Policy type"
            rules={[
              {
                required: true,
                message: 'Please select policy type!'
              }
            ]}
          >
            <Select labelInValue className="w-full">
              {optionTypes &&
                optionTypes.map(({ code, name }) => (
                  <Option key={code} value={code}>
                    {name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: 'Please input policy name!'
              }
            ]}
          >
            <Input placeholder="E.g. Hoa hồng phái sinh 01" />
          </Form.Item>

          <Form.Item
            name="effectiveDate"
            label="Effective date"
            rules={[
              {
                required: true,
                message: 'Please select effective date!'
              }
            ]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              allowClear={false}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="expiryDate"
            label="Expiry date"
            rules={[
              {
                required: true,
                message: 'Please select expiry date!'
              }
            ]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              allowClear={false}
              className="w-full"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="beneficialValueFactor"
            label="Beneficial value"
            rules={[
              {
                required: true,
                message: 'Please select beneficial value!'
              }
            ]}
          >
            <Select labelInValue className="w-full">
              {optionBeneficialValues &&
                optionBeneficialValues.map(({ id, name }) => (
                  <Option key={id} value={id}>
                    {name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
