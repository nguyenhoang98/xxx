import React, { useCallback } from 'react';
import PolicyStepThreeRankValue from 'components/Policy/PolicyStepThreeRankValue';
import { Form } from 'antd';

export default function PolicyStepThree({ formStepThree, setStepPercent }) {
  const onFinishStepThree = useCallback(() => {
    setStepPercent({ step: 3, percent: 90 });
  }, []);

  return (
    <>
      <Form
        form={formStepThree}
        name="policy"
        labelCol={{ span: 9 }}
        onFinish={onFinishStepThree}
        initialValues={{
          rankConcernedValueFactor: { key: '', value: '', label: '' },
          rankType: 'CLUSTER',
          rankTypeLabel: 'Lũy kế',
          rankValueType: 'RATE',
          ranks: [
            {
              from: 0,
              to: null,
              rate: 0,
              fixed: 0
            }
          ]
        }}
      >
        <PolicyStepThreeRankValue form={formStepThree} />
      </Form>
    </>
  );
}
