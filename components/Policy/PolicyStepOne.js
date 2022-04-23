import React, { useCallback } from 'react';
import dayjs from 'dayjs';
import PolicyStepOneDefinition from 'components/Policy/PolicyStepOneDefinition';
import PolicyStepOneBeneficiary from 'components/Policy/PolicyStepOneBeneficiary';
import PolicyStepOneProduct from 'components/Policy/PolicyStepOneProduct';
import PolicyStepOneTerm from 'components/Policy/PolicyStepOneTerm';
import { Form } from 'antd';

function PolicyStepOne({ formStepOne, setStepPercent }) {
  const today = dayjs();
  const onFinishStepOne = useCallback(() => {
    setStepPercent({ step: 1, percent: 50 });
  }, []);

  return (
    <Form
      form={formStepOne}
      name="policy"
      labelCol={{ span: 9 }}
      onFinish={onFinishStepOne}
      scrollToFirstError
      initialValues={{
        type: { key: '', value: '', label: '' },
        name: null,
        effectiveDate: today,
        expiryDate: today,
        beneficialValueFactor: { key: '', value: '', label: '' },
        description: null,
        beneficiary: '',
        products: [
          {
            effectiveDate: today,
            expiryDate: today,
            product: {}
          }
        ],
        term: {
          calculationCycle: { key: '', value: '', label: '' },
          closingTime: { key: '', value: '', label: '' },
          dayOfMonth: null,
          numberOfDays: null
        }
      }}
    >
      <PolicyStepOneDefinition form={formStepOne} />
      <PolicyStepOneBeneficiary form={formStepOne} />
      <PolicyStepOneProduct form={formStepOne} />
      <PolicyStepOneTerm form={formStepOne} />
    </Form>
  );
}

export default React.memo(PolicyStepOne);
