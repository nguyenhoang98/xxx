import policyApi from 'api/policyApi';
import { Select } from 'antd';

const { Option } = Select;

export function ListingOptionPolicyTypes({ value = {}, onChange, queryList }) {
  const { data: optionPolicyTypes } = policyApi.getAllPolicyTypes();

  const handleChange = value => {
    if (onChange) {
      onChange(value);
      queryList();
    }
  };

  return (
    <Select onChange={handleChange} placeholder="Policy type" allowClear>
      {optionPolicyTypes &&
        // eslint-disable-next-line no-shadow
        optionPolicyTypes.map(({ code, name }) => (
          <Option key={code} value={code}>
            {name}
          </Option>
        ))}
    </Select>
  );
}
