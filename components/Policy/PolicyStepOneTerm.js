import { useState, useEffect } from 'react';
import policyApi from 'api/policyApi';
import { Form, Row, Col, Typography, Select } from 'antd';

const { Title } = Typography;
const { Option } = Select;

export default function PolicyStepOneTerm({ form }) {
  const { term } = form.getFieldValue();
  const [isNumberOfDaysDisable, setIsNumberOfDaysDisable] = useState(
    term.calculationCycle.key !== 'CUSTOMIZE'
  );
  const [isDayOfMonthDisable, setIsDayOfMonthDisable] = useState(
    term.closingTime.key === 'END_OF_PERIOD'
  );
  const { data: optionCalculationCycles } = policyApi.getAllCalculationCycles();
  const { data: optionClosingTimes } = policyApi.getAllClosingTimes();

  useEffect(() => {
    if (term?.calculationCycle.key === '' && optionCalculationCycles) {
      form.setFieldsValue({
        term: {
          calculationCycle: {
            key: optionCalculationCycles[0].code,
            value: optionCalculationCycles[0].code,
            label: optionCalculationCycles[0].name
          }
        }
      });
    }
  }, [optionCalculationCycles]);

  useEffect(() => {
    if (term?.closingTime.key === '' && optionClosingTimes) {
      form.setFieldsValue({
        term: {
          closingTime: {
            key: optionClosingTimes[0].code,
            value: optionClosingTimes[0].code,
            label: optionClosingTimes[0].name
          }
        }
      });
    }
  }, [optionClosingTimes]);

  const optionDayOfMonth = [];
  for (let i = 1; i <= 28; i += 1) {
    optionDayOfMonth.push({ value: i });
  }

  const optionNumberOfDays = [];
  for (let i = 1; i <= 1000; i += 1) {
    optionNumberOfDays.push({ value: i });
  }

  const setClosingTimeEndOfPeriod = () => {
    const optionEndOfPeriod = optionClosingTimes.filter(
      item => item.code === 'END_OF_PERIOD'
    );

    form.setFieldsValue({
      term: {
        closingTime: {
          key: optionEndOfPeriod[0].code,
          value: optionEndOfPeriod[0].code,
          label: optionEndOfPeriod[0].name
        }
      }
    });
  };

  const disableDayOfMonth = () => {
    setIsDayOfMonthDisable(true);
    form.setFieldsValue({
      term: {
        dayOfMonth: null
      }
    });
  };

  const disableNumberOfDays = () => {
    setIsNumberOfDaysDisable(true);
    form.setFieldsValue({
      term: {
        numberOfDays: null
      }
    });
  };

  const onCheckTermValueDisabled = option => {
    if (option.value === 'CUSTOMIZE') {
      setClosingTimeEndOfPeriod();
    }

    const currentTerm = form.getFieldValue('term');

    setIsDayOfMonthDisable(false);
    if (currentTerm.closingTime.value === 'END_OF_PERIOD') {
      disableDayOfMonth();
    }

    currentTerm.calculationCycle.value === 'CUSTOMIZE' &&
    currentTerm.closingTime.value === 'END_OF_PERIOD'
      ? setIsNumberOfDaysDisable(false)
      : disableNumberOfDays();
  };

  const checkCustomizeCalculationCycle = value =>
    isNumberOfDaysDisable === false && value === 'DATE';

  return (
    <>
      <Title level={4} type="warning" className="mt-8">
        4. Term
      </Title>
      <Row>
        <Col span={12}>
          <Form.Item
            name={['term', 'calculationCycle']}
            label="Calculation cycle"
            rules={[
              {
                required: true,
                message: 'Please select calculation cycle!'
              }
            ]}
          >
            <Select
              labelInValue
              className="w-full"
              onChange={onCheckTermValueDisabled}
            >
              {optionCalculationCycles &&
                optionCalculationCycles.map(({ code, name }) => (
                  <Option key={code} value={code}>
                    {name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={['term', 'closingTime']}
            label="Closing time"
            rules={[
              {
                required: true,
                message: 'Please input closing time!'
              }
            ]}
          >
            <Select
              labelInValue
              className="w-full"
              onChange={onCheckTermValueDisabled}
            >
              {optionClosingTimes &&
                optionClosingTimes.map(({ code, name }) => (
                  <Option
                    key={code}
                    value={code}
                    disabled={checkCustomizeCalculationCycle(code)}
                  >
                    {name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={['term', 'numberOfDays']}
            label="No. of days"
            rules={[
              {
                required: !isNumberOfDaysDisable,
                message: 'Please input closing time!'
              }
            ]}
          >
            <Select
              style={{ width: '100%' }}
              showSearch
              disabled={isNumberOfDaysDisable}
              options={optionNumberOfDays}
              placeholder="Please select"
            />
          </Form.Item>

          <Form.Item
            name={['term', 'dayOfMonth']}
            label="Day of month"
            rules={[
              {
                required: !isDayOfMonthDisable,
                message: 'Please input closing time!'
              }
            ]}
          >
            <Select
              style={{ width: '100%' }}
              showSearch
              disabled={isDayOfMonthDisable}
              options={optionDayOfMonth}
              placeholder="Please select"
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
