import productApi from 'api/productApi';
import { Select } from 'antd';

const { Option } = Select;

export function ListingOptionProductTypes({
  value,
  onChange,
  queryList,
  labelInValue
}) {
  const { data: optionProductTypes } = productApi.getAllProductTypes();

  const handleChange = value => {
    if (onChange) {
      onChange(value);
      if (queryList) queryList();
    }
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      labelInValue={labelInValue}
      placeholder="Product type"
      allowClear
    >
      {optionProductTypes &&
        optionProductTypes.map(({ code, name }) => (
          <Option key={code} value={code}>
            {name}
          </Option>
        ))}
    </Select>
  );
}
