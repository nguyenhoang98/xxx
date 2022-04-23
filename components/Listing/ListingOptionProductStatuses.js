import productApi from 'api/productApi';
import { Select } from 'antd';

const { Option } = Select;

export function ListingOptionProductStatuses({
  value = {},
  onChange,
  queryList
}) {
  const { data: optionProductStatuses } = productApi.getAllProductStatuses();

  const handleChange = value => {
    if (onChange) {
      onChange(value);
      queryList();
    }
  };

  return (
    <Select onChange={handleChange} placeholder="Status" allowClear>
      {optionProductStatuses &&
        // eslint-disable-next-line no-shadow
        optionProductStatuses.map(({ code, name }) => (
          <Option key={code} value={code}>
            {name}
          </Option>
        ))}
    </Select>
  );
}
