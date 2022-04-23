import { Tag } from 'antd';
import React from 'react';

const generateTag = (status, record) => {
  const colors = {
    PENDING: 'geekblue',
    ACTIVATED: 'green',
    DEACTIVATED: 'volcano',
    REFUSED: 'cyan'
  };
  return (
    <Tag color={colors[status]} key={record.id}>
      {status}
    </Tag>
  );
};
export default generateTag;
