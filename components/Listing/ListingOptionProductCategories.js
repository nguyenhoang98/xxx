import productApi from 'api/productApi';
import { convertFlatArray } from 'utils/common';
import { Select } from 'antd';

const { Option } = Select;

export function ListingOptionProductCategories({
  value,
  onChange,
  queryList,
  categoryAction,
  mode
}) {
  const { data: optionProductCategories } = productApi.getCategoryTree();
  const listProductCategory = convertFlatArray(optionProductCategories);

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
      mode={mode}
      placeholder="Product category"
      allowClear
      disabled={categoryAction === 'EDIT'}
    >
      {listProductCategory &&
        listProductCategory.map((item, index) => (
          <Option key={index} value={item.id}>
            <div style={{ paddingLeft: `${item.level * 15}px` }}>
              {item.name}
            </div>
          </Option>
        ))}
    </Select>
  );
}
