import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import policyApi from 'api/policyApi';
import { Steps, Form, Card, Button, Space, Divider, message } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import PolicyStepOne from 'components/Policy/PolicyStepOne';
import PolicyStepTwo from 'components/Policy/PolicyStepTwo';
import PolicyStepThree from 'components/Policy/PolicyStepThree';
import PolicyStepFour from 'components/Policy/PolicyStepFour';
import PolicyStepOnePreview from 'components/Policy/PolicyStepOnePreview';
import PolicyStepTwoPreview from 'components/Policy/PolicyStepTwoPreview';
import PolicyStepThreePreview from 'components/Policy/PolicyStepThreePreview';

const { Step } = Steps;

export default function PolicyCreate() {
  const router = useRouter();
  const [current, setCurrent] = useState({
    step: 0,
    percent: 0
  });
  const [loading, setLoading] = useState(false);
  const [formStepOne] = Form.useForm();
  const [formStepTwo] = Form.useForm();
  const [formStepThree] = Form.useForm();
  const [formStepFour] = Form.useForm();

  const setStepPercent = useCallback(currentStep => {
    setCurrent(currentStep);
  }, []);

  const steps = [
    {
      step: 1,
      title: 'Policy information',
      description: 'Define beneficiaries, products and terms',
      content: (
        <PolicyStepOne
          formStepOne={formStepOne}
          setStepPercent={setStepPercent}
        />
      )
    },
    {
      step: 2,
      title: 'Conditions',
      description: 'Add transaction conditions',
      content: (
        <>
          <PolicyStepOnePreview formStepOne={formStepOne} />
          <PolicyStepTwo
            formStepTwo={formStepTwo}
            setStepPercent={setStepPercent}
          />
        </>
      )
    },
    {
      step: 3,
      title: 'Rank value',
      description: 'Set up commission rate by rank value',
      content: (
        <>
          <PolicyStepOnePreview formStepOne={formStepOne} />
          <PolicyStepTwoPreview formStepTwo={formStepTwo} />
          <PolicyStepThree
            formStepThree={formStepThree}
            setStepPercent={setStepPercent}
          />
        </>
      )
    },
    {
      step: 4,
      title: 'Confirmation',
      description: 'Double check policy details and confirm',
      content: (
        <>
          <PolicyStepOnePreview formStepOne={formStepOne} />
          <PolicyStepTwoPreview formStepTwo={formStepTwo} />
          <PolicyStepThreePreview formStepThree={formStepThree} />
          <PolicyStepFour
            formStepOne={formStepOne}
            formStepTwo={formStepTwo}
            formStepThree={formStepThree}
            formStepFour={formStepFour}
            setStepPercent={setStepPercent}
          />
        </>
      )
    }
  ];

  const next = () => {
    const stepTest = {
      0: () => formStepOne.submit(),
      1: () => formStepTwo.submit(),
      2: () => formStepThree.submit()
    };
    return stepTest[current.step]();
  };

  const prev = () => {
    const step = current.step - 1;
    const percents = {
      0: 0,
      1: 50,
      2: 70,
      3: 90
    };

    setStepPercent({ step, percent: percents[step] });
  };

  const onCancel = () => router.push('/policy/list');

  const transformData = () => {
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
    } = formStepOne.getFieldsValue();
    const { conditions } = formStepTwo.getFieldsValue();
    const {
      rankConcernedValueFactor,
      rankType,
      rankValueType,
      ranks
    } = formStepThree.getFieldsValue();

    const productsTransform = products.map(item => {
      return {
        effectiveDate: dayjs(item.effectiveDate).valueOf(),
        expiryDate: dayjs(item.expiryDate).valueOf(),
        id: item.product.id
      };
    });

    const termTransform = {
      calculationCycle: term.calculationCycle.value,
      closingTime: term.closingTime.value,
      dayOfMonth: term.dayOfMonth,
      numberOfDays: term.numberOfDays
    };

    const conditionsTransform = conditions.map(item => {
      return {
        factorId: item.factor.value,
        operatorId: item.operator.value,
        value: item.value
      };
    });

    return {
      businessId: 3,
      type: type.value,
      name,
      effectiveDate: dayjs(effectiveDate).valueOf(),
      expiryDate: dayjs(expiryDate).valueOf(),
      beneficialValueFactor: beneficialValueFactor.value,
      description,
      beneficiaryId: beneficiary.id,
      products: productsTransform,
      term: termTransform,
      conditions: conditionsTransform,
      rankConcernedValueFactor: rankConcernedValueFactor.value,
      rankType,
      rankValueType,
      ranks
    };
  };

  const createPolicy = async () => {
    setLoading(true);
    const payload = transformData();
    await policyApi.createPolicy(payload);
    message.success('Create policy successfully!');
    router.push('/policy/list');
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-center p-3 bg-white">
        <Steps
          current={current.step}
          percent={current.percent}
          className="max-w-screen-lg"
        >
          {steps.map(item => (
            <Step
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </Steps>
      </div>
      <div className="flex justify-center">
        <Card className="w-full max-w-screen-md mt-2">
          {steps.map(item => (
            <div
              key={item.step}
              style={item.step !== current.step + 1 ? { display: 'none' } : {}}
            >
              {item.content}
            </div>
          ))}
          <Divider />
          <div className="flex justify-end">
            <Space>
              <Button
                type="text"
                className="text-yellow-500"
                onClick={onCancel}
              >
                Cancel
              </Button>

              {current.step > 0 && (
                <Button
                  className="w-24"
                  icon={<DoubleLeftOutlined />}
                  onClick={prev}
                >
                  Back
                </Button>
              )}
              {current.step < steps.length - 1 && (
                <Button type="primary" onClick={next} className="w-24">
                  Next
                  <DoubleRightOutlined />
                </Button>
              )}

              {current.step === steps.length - 1 && (
                <Button
                  type="primary"
                  loading={loading}
                  onClick={createPolicy}
                  className="w-24"
                >
                  Finish
                </Button>
              )}
            </Space>
          </div>
        </Card>
      </div>
    </>
  );
}
