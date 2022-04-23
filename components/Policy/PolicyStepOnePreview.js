import React from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import tw from 'twin.macro';
import { nanoid } from 'nanoid';
import { Form, Row, Col, Typography, Table } from 'antd';

const { Title, Text } = Typography;

export default function PolicyStepOnePreview({ formStepOne }) {
  const transformData = () => {
    if (typeof formStepOne.getFieldsValue === 'function') {
      return formStepOne.getFieldsValue();
    }

    return {
      type: { label: formStepOne.typeName },
      beneficialValueFactor: { label: formStepOne.beneficialValue.name },
      name: formStepOne.name,
      effectiveDate: formStepOne.effectiveDate,
      expiryDate: formStepOne.expiryDate,
      description: formStepOne.description,
      beneficiary: formStepOne.beneficiary,
      products: formStepOne.products,
      term: {
        calculationCycle: { label: formStepOne.term.calculationCycleName },
        closingTime: { label: formStepOne.term.closingTimeName },
        numberOfDays: formStepOne.term.numberOfDays,
        dayOfMonth: formStepOne.term.dayOfMonth
      }
    };
  };

  const {
    type,
    name,
    effectiveDate,
    expiryDate,
    beneficialValueFactor,
    description,
    beneficiary,
    products,
    term
  } = transformData();

  const colProducts = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'right',
      width: 50,
      render: (value, row, index) => index + 1
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (_, record) => `${record.product?.code} - ${record.product?.name}`
    },
    {
      title: 'Effective date',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      width: 120,
      render: fromDate => dayjs(fromDate).format('DD-MM-YYYY')
    },
    {
      title: 'Expiry date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 120,
      render: toDate => dayjs(toDate).format('DD-MM-YYYY')
    }
  ];

  return (
    <FormPreview labelCol={{ span: 8 }}>
      <Title level={5}>Policy information</Title>
      <Row>
        <Col span={12}>
          <Form.Item label="Policy type">
            <Text strong>{type?.label}</Text>
          </Form.Item>
          <Form.Item label="Name">
            <Text strong>{name}</Text>
          </Form.Item>
          <Form.Item label="Effective date">
            <Text strong>{dayjs(effectiveDate).format('DD/MM/YYYY')}</Text>
          </Form.Item>
          <Form.Item label="Expiry date">
            <Text strong>{dayjs(expiryDate).format('DD/MM/YYYY')}</Text>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Beneficial value">
            <Text strong>{beneficialValueFactor?.label}</Text>
          </Form.Item>
          <Form.Item label="Description">
            <Text strong>{description}</Text>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="Beneficiary" labelCol={{ span: 4 }}>
            <Text strong>{beneficiary?.fullText}</Text>
          </Form.Item>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col span={24}>
          <Form.Item label="Products" labelCol={{ span: 4 }}>
            <Table
              dataSource={products}
              columns={colProducts}
              pagination={false}
              size="small"
              bordered
              rowKey={() => nanoid()}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item label="Calculation cycle">
            <Text strong>{term?.calculationCycle?.label}</Text>
          </Form.Item>
          <Form.Item label="Closing time">
            <Text strong>{term?.closingTime?.label}</Text>
          </Form.Item>
        </Col>
        <Col span={12}>
          {term?.numberOfDays && (
            <Form.Item label="Number of days">
              <Text strong>{term?.numberOfDays}</Text>
            </Form.Item>
          )}
          {term?.dayOfMonth && (
            <Form.Item label="Day of month">
              <Text strong>{term?.dayOfMonth}</Text>
            </Form.Item>
          )}
        </Col>
      </Row>
    </FormPreview>
  );
}

const FormPreview = styled(Form)`
  & {
    .ivnd-form-item {
      ${tw`mb-1`}
    }
  }
`;
