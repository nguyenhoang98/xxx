import { useState, useCallback } from 'react';
import { useDebounce } from 'utils/useDebounce';
import { isObj } from 'utils/common';
import styled from 'styled-components';
import tw from 'twin.macro';
import {
  Form,
  Typography,
  Row,
  Col,
  AutoComplete,
  Select,
  Button,
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleTwoTone,
  CheckCircleTwoTone,
  CloseOutlined
} from '@ant-design/icons';
import policyApi from 'api/policyApi';
import PolicyStepOneBeneficiaryCreateModal from './PolicyStepOneBeneficiaryCreateModal';

const { Title, Link, Text } = Typography;
const { Option } = Select;

export default function PolicyStepOneBeneficiary({ form }) {
  const { beneficiary } = form.getFieldsValue();
  const [searchTerm, setSearchTerm] = useState(beneficiary?.fullText);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data } = policyApi.searchBeneficiaries({
    keyword: debouncedSearchTerm
  });
  const options = data?.content;

  const openModalCertificate = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const closeBeneficiaryCreateModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const onChangeBeneficiary = useCallback(query => {
    setSearchTerm(query);
  }, []);

  const setFormBeneficiaryItem = useCallback(item => {
    setSearchTerm(item.fullText);
    form.setFieldsValue({ beneficiary: item });
  }, []);

  const onSelectBeneficiary = (value, option) => {
    const { item } = option;
    value === null ? openModalCertificate() : setFormBeneficiaryItem(item);
  };

  const clearBeneficiaryItem = () => {
    setFormBeneficiaryItem('');
    setSearchTerm('');
  };

  return (
    <>
      <Title level={4} type="warning" className="mt-2">
        2. Add beneficiary*
      </Title>
      <RowContainer>
        <Col span={24}>
          <Form.Item
            name="beneficiary"
            rules={[
              {
                validator: (_, value) =>
                  isObj(value)
                    ? Promise.resolve()
                    : // eslint-disable-next-line prefer-promise-reject-errors
                      Promise.reject('Please select beneficiary!')
              }
            ]}
          >
            <SearchContainer>
              <SearchOutlined />
              <AutoComplete
                value={searchTerm}
                onChange={onChangeBeneficiary}
                onSelect={onSelectBeneficiary}
                backfill
                defaultActiveFirstOption
                disabled={!!beneficiary?.fullText}
                placeholder="Search Role/JD/Title/POS"
                className="mr-2"
              >
                {options &&
                  options.map(item => (
                    <Option key={item.id} value={item.fullText} item={item}>
                      {item.fullText}
                    </Option>
                  ))}
                <Option>
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    className="w-full"
                  >
                    Create new beneficiary...
                  </Button>
                </Option>
              </AutoComplete>

              <Tooltip title="Clear beneficiary">
                <Button
                  icon={<CloseOutlined />}
                  disabled={!beneficiary?.fullText}
                  onClick={clearBeneficiaryItem}
                />
              </Tooltip>
            </SearchContainer>
          </Form.Item>
        </Col>
      </RowContainer>
      <Row>
        <Col span={1}>
          {!beneficiary?.fullText ? (
            <ExclamationCircleTwoTone
              twoToneColor="#EF4444"
              className="mt-1 text-xl"
            />
          ) : (
            <CheckCircleTwoTone
              twoToneColor="#22C55E"
              className="mt-1 text-xl"
            />
          )}
        </Col>
        <Col span={23} className="flex items-center">
          {!beneficiary?.fullText ? (
            <Text className="ant-form-text" type="secondary">
              Please select beneficiary or{' '}
              <Link onClick={openModalCertificate}>create a new one</Link>.
            </Text>
          ) : (
            <Text className="ivnd-form-text">{beneficiary?.fullText}</Text>
          )}
        </Col>
      </Row>

      <PolicyStepOneBeneficiaryCreateModal
        isModalVisible={isModalVisible}
        closeBeneficiaryCreateModal={closeBeneficiaryCreateModal}
        setFormBeneficiaryItem={setFormBeneficiaryItem}
      />
    </>
  );
}

const RowContainer = styled(Row)`
  & {
    .ivnd-form-item-control {
      max-width: 100%;
    }
  }
`;

const SearchContainer = styled.div`
  ${tw`relative flex items-center`}
  & {
    .anticon-search {
      ${tw`absolute z-10 left-2`}
      color: #94a3b8;
    }
    .ivnd-select-single .ivnd-select-selector .ivnd-select-selection-search {
      ${tw`left-7`}
    }
    .ivnd-select-single:not(.ivnd-select-customize-input)
      .ivnd-select-selector {
      ${tw`pl-7`}
    }
    .ivnd-form-item-control {
      ${tw`w-full`}
    }
  }
`;
