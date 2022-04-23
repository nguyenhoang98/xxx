import { useState, useCallback } from 'react';
import { useDebounce } from 'utils/useDebounce';
import { isObj } from 'utils/common';
import dayjs from 'dayjs';
import styled from 'styled-components';
import tw from 'twin.macro';
import {
  Form,
  Typography,
  Button,
  AutoComplete,
  Space,
  Select,
  DatePicker,
  Tooltip
} from 'antd';
import { PlusOutlined, SearchOutlined, MinusOutlined } from '@ant-design/icons';
import policyApi from 'api/policyApi';

const { Title } = Typography;
const { Option } = Select;

export default function PolicyStepOneProduct({ form }) {
  const today = dayjs();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data } = policyApi.searchProducts({
    keyword: debouncedSearchTerm
  });
  const options = data?.content;

  const setPreviousEffectiveDate = useCallback(() => {
    const { products } = form.getFieldValue();
    return products.length > 0
      ? products[products.length - 1].effectiveDate
      : today;
  }, []);

  const setPreviousExpiryDate = useCallback(() => {
    const { products } = form.getFieldValue();
    return products.length > 0
      ? products[products.length - 1].expiryDate
      : today;
  }, []);

  const onSearchProduct = useCallback(query => {
    setSearchTerm(query);
  }, []);

  const onSelectProduct = useCallback((value, option) => {
    const { item, index } = option;
    const tmpProducts = [...form.getFieldValue('products')];
    tmpProducts[index].product = item;
    form.setFieldsValue({ products: tmpProducts });
  }, []);

  const setProductValue = useCallback(index => {
    const { products } = form.getFieldValue();
    if (products[index].product.code)
      return `${products[index].product.code} - ${products[index].product.name}`;
  }, []);

  return (
    <>
      <Title level={4} type="warning" className="mt-8">
        3. Add product*
      </Title>
      <Form.List name="products">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Space key={field.key} align="baseline">
                <Form.Item
                  {...field}
                  name={[field.name, 'product']}
                  fieldKey={[field.fieldKey, 'product']}
                  validateTrigger={['onBlur']}
                  rules={[
                    {
                      validator: (_, value) =>
                        isObj(form.getFieldValue('products')[index].product)
                          ? Promise.resolve()
                          : // eslint-disable-next-line prefer-promise-reject-errors
                            Promise.reject('Please select product!')
                    }
                  ]}
                >
                  <SearchContainer>
                    <SearchOutlined />
                    <AutoComplete
                      value={setProductValue(index)}
                      onSearch={onSearchProduct}
                      onSelect={onSelectProduct}
                      backfill
                      defaultActiveFirstOption
                      placeholder="Search product code/name"
                      style={{ width: 359 }}
                    >
                      {options &&
                        options.map(item => (
                          <Option
                            key={item.id}
                            value={`${item.code} - ${item.name}`}
                            item={item}
                            index={index}
                          >
                            {item.code} - {item.name}
                          </Option>
                        ))}
                    </AutoComplete>
                  </SearchContainer>
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, 'effectiveDate']}
                  fieldKey={[field.fieldKey, 'effectiveDate']}
                  rules={[
                    {
                      required: true,
                      message: 'Please select effective date!'
                    }
                  ]}
                >
                  <DatePicker
                    format="DD-MM-YYYY"
                    allowClear={false}
                    placeholder="Effective date"
                  />
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, 'expiryDate']}
                  fieldKey={[field.fieldKey, 'expiryDate']}
                  rules={[
                    {
                      required: true,
                      message: 'Please select expiry date!'
                    }
                  ]}
                >
                  <DatePicker
                    format="DD-MM-YYYY"
                    allowClear={false}
                    placeholder="Expiry date"
                  />
                </Form.Item>

                <Tooltip title="Remove product">
                  <Button
                    shape="circle"
                    size="small"
                    icon={<MinusOutlined />}
                    disabled={fields.length === 1}
                    onClick={() => remove(field.name)}
                  />
                </Tooltip>
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  add({
                    product: '',
                    effectiveDate: setPreviousEffectiveDate(),
                    expiryDate: setPreviousExpiryDate()
                  });
                }}
                block
                icon={<PlusOutlined />}
                className="w-full"
              >
                Add product
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}

const SearchContainer = styled.div`
  & {
    .anticon-search {
      ${tw`absolute z-10 left-2`}
      color: #94a3b8;
      top: 9px;
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
