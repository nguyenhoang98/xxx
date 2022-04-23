import React from 'react';
import PolicyStepFourDocument from 'components/Policy/PolicyStepFourDocument';
import { Form } from 'antd';

function PolicyStepFour({ formStepFour }) {
  return (
    <>
      <Form form={formStepFour} name="policy" labelCol={{ span: 9 }}>
        <PolicyStepFourDocument />
      </Form>
    </>
  );
}

export default React.memo(PolicyStepFour);
