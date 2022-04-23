import React from 'react';
import { formatCurrency } from 'utils/common';
import styled from 'styled-components';
import tw from 'twin.macro';
import { nanoid } from 'nanoid';
import { Form, Row, Col, Typography, Table, Divider } from 'antd';

const { Title } = Typography;

export default function PolicyStepTwoPreview({ formStepTwo }) {
  const transformData = () => {
    if (typeof formStepTwo.getFieldsValue === 'function') {
      return formStepTwo.getFieldsValue();
    }

    const conditions = formStepTwo.conditions.map(condition => {
      return {
        factor: { label: condition.factor.name },
        operator: { label: condition.operator.name },
        value: condition.value
      };
    });

    return { conditions };
  };

  const { conditions } = transformData();

  const colConditions = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'right',
      width: 50,
      render: (value, row, index) => index + 1
    },
    {
      title: 'Factor',
      dataIndex: 'factor',
      key: 'factor',
      render: factor => factor?.label
    },
    {
      title: 'Operator',
      dataIndex: 'operator',
      key: 'operator',
      render: operator => operator?.label
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      align: 'right',
      render: value => formatCurrency(value)
    }
  ];

  return (
    <>
      {conditions?.length > 0 && (
        <FormPreview labelCol={{ span: 8 }}>
          <Row justify="center">
            <Divider style={{ minWidth: '50%', width: '50%' }} />
          </Row>
          <Title level={5}>Transaction conditions</Title>
          <Row className="mt-2">
            <Col span={24}>
              <Table
                dataSource={conditions}
                columns={colConditions}
                pagination={false}
                size="small"
                bordered
                rowKey={() => nanoid()}
              />
            </Col>
          </Row>
        </FormPreview>
      )}
    </>
  );
}

const FormPreview = styled(Form)`
  & {
    .ivnd-form-item {
      ${tw`mb-1`}
    }
  }
`;
