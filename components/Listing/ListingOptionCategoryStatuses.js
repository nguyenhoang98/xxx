import productApi from 'api/productApi';
import { Select } from 'antd';

const { Option } = Select;

export function ListingOptionCategoryStatuses({
  value = {},
  onChange,
  queryList
}) {
  const { data: optionCategoryStatuses } = productApi.getAllCategoryStatuses();

  const handleChange = value => {
    if (onChange) {
      onChange(value);
      queryList();
    }
  };

  return (
    <Select onChange={handleChange} placeholder="Status" allowClear>
      {optionCategoryStatuses &&
        // eslint-disable-next-line no-shadow
        optionCategoryStatuses.map(({ code, name }) => (
          <Option key={code} value={code}>
            {name}
          </Option>
        ))}
    </Select>
  );
}
