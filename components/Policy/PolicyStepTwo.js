import React, { useCallback } from 'react';
import PolicyStepTwoTransaction from 'components/Policy/PolicyStepTwoTransaction';
import { Form } from 'antd';

function PolicyStepTwo({ formStepTwo, setStepPercent }) {
  const onFinishStepTwo = useCallback(() => {
    setStepPercent({ step: 2, percent: 70 });
  }, []);

  return (
    <>
      <Form
        form={formStepTwo}
        name="policy"
        labelCol={{ span: 9 }}
        onFinish={onFinishStepTwo}
        initialValues={{
          conditions: []
        }}
      >
        <PolicyStepTwoTransaction form={formStepTwo} />
      </Form>
    </>
  );
}

export default React.memo(PolicyStepTwo);
