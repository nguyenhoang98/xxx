import { useState, useCallback, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRouter } from 'next/router';
import { menuRoutes } from 'api/menuRoutes';
import { AutoComplete } from 'antd';
import { SearchOutlined, EnterOutlined } from '@ant-design/icons';
import { SearchContainer, SearchHotKey } from './PageSearch.styled';

const { Option } = AutoComplete;

export default function PageSearch() {
  const router = useRouter();
  const pages = menuRoutes
    .map(route => (route.menuItems ? route.menuItems : route))
    .flat();

  const [options, setOptions] = useState([]);
  const searchInput = useRef();

  useHotkeys('ctrl+k, command+k', () => searchInput.current.focus(), {
    enableOnTags: ['INPUT', 'SELECT', 'TEXTAREA']
  });

  const onSearch = useCallback(query => {
    const results = query
      ? pages.filter(({ label, code }) => {
          return (
            label.toLowerCase().includes(query.toLowerCase()) ||
            code.toLowerCase().includes(query.toLowerCase())
          );
        })
      : [];

    setOptions(results);
  }, []);

  const onSelect = (value, option) => {
    router.push(option.path);
  };

  return (
    <SearchContainer>
      <SearchOutlined />
      <AutoComplete
        ref={searchInput}
        style={{ width: 468 }}
        onSearch={onSearch}
        onSelect={onSelect}
        backfill
        defaultActiveFirstOption
        dropdownClassName="ivnd-search-page-dropdown"
        placeholder="Tìm kiếm báo cáo"
      >
        {options.map(({ code, path, label }) => (
          <Option key={code} value={code} path={path}>
            <div className="flex items-center justify-between">
              <div className="flex flex-col flex-auto min-w-0">
                <span className="text-sm text-gray-500">{code}</span>
                <span className="overflow-hidden text-sm font-medium text-gray-800 overflow-ellipsis whitespace-nowrap">
                  {label}
                </span>
              </div>
              <EnterOutlined className="text-base text-gray-500" />
            </div>
          </Option>
        ))}
      </AutoComplete>
      <SearchHotKey onClick={() => searchInput.current.focus()}>
        <kbd>Ctrl K</kbd>
      </SearchHotKey>
    </SearchContainer>
  );
}
