import productApi from 'api/productApi';
import { Select } from 'antd';

const { Option } = Select;

export function ListingOptionCategoryCreators({
  value = {},
  onChange,
  queryList
}) {
  const { data: listCreator } = productApi.getAllCategoryCreators();
  const listCreatorCategory = listCreator?.content;

  const handleChange = value => {
    if (onChange) {
      onChange(value);
      queryList();
    }
  };

  return (
    <Select
      allowClear
      placeholder="Creator"
      className="w-full"
      onChange={handleChange}
    >
      {listCreatorCategory &&
        // eslint-disable-next-line no-shadow
        listCreatorCategory.map(item => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
    </Select>
  );
}
