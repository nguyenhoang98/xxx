import policyApi from 'api/policyApi';
import { Select } from 'antd';

const { Option } = Select;

export function ListingOptionPolicyStatuses({
  value = {},
  onChange,
  queryList
}) {
  const { data: optionPolicyStatuses } = policyApi.getAllPolicyStatuses();

  const handleChange = value => {
    if (onChange) {
      onChange(value);
      queryList();
    }
  };

  return (
    <Select onChange={handleChange} placeholder="Status" allowClear>
      {optionPolicyStatuses &&
        // eslint-disable-next-line no-shadow
        optionPolicyStatuses.map(({ code, name }) => (
          <Option key={code} value={code}>
            {name}
          </Option>
        ))}
    </Select>
  );
}
