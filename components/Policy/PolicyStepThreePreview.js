import React from 'react';
import { formatCurrency } from 'utils/common';
import styled from 'styled-components';
import tw from 'twin.macro';
import { nanoid } from 'nanoid';
import { Form, Row, Col, Typography, Table, Divider } from 'antd';

const { Title, Text } = Typography;

export default function PolicyStepThreePreview({ formStepThree }) {
  const transformData = () => {
    if (typeof formStepThree.getFieldsValue === 'function') {
      return formStepThree.getFieldsValue();
    }

    return {
      rankConcernedValueFactor: {
        label: formStepThree.rankConcernedValue.name
      },
      rankTypeLabel: formStepThree.rankTypeName,
      rankValueType: formStepThree.rankValueType,
      ranks: formStepThree.ranks
    };
  };

  const {
    rankConcernedValueFactor,
    rankTypeLabel,
    rankValueType,
    ranks
  } = transformData();

  const columnRanks = [
    {
      title: 'Min rank',
      dataIndex: 'from',
      key: 'from',
      align: 'right',
      render: from => formatCurrency(from)
    },
    {
      title: 'Max rank',
      dataIndex: 'to',
      key: 'to',
      align: 'right',
      render: to => (to === null ? <span>&#8734;</span> : formatCurrency(to))
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      align: 'right',
      width: 120,
      render: value => rankValueType === 'RATE' && `${value}%`
    },
    {
      title: 'Fixed value',
      dataIndex: 'fixed',
      key: 'fixed',
      align: 'right',
      width: 120,
      render: fixed => rankValueType === 'FIX' && formatCurrency(fixed)
    }
  ];

  return (
    <>
      {ranks?.length > 0 && (
        <FormPreview labelCol={{ span: 8 }}>
          <Row justify="center">
            <Divider style={{ minWidth: '50%', width: '50%' }} />
          </Row>
          <Title level={5}>Rank value</Title>
          <Row className="mt-2">
            <Col span={12}>
              <Form.Item label="Concerned value">
                <Text strong>{rankConcernedValueFactor?.label}</Text>
              </Form.Item>
              <Form.Item label="Rank type">
                <Text strong>{rankTypeLabel}</Text>
              </Form.Item>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col span={24}>
              <Table
                dataSource={ranks}
                columns={columnRanks}
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
