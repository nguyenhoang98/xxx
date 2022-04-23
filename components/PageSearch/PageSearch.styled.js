import styled from 'styled-components';
import tw from 'twin.macro';

const SearchContainer = styled.div`
  ${tw`relative flex items-center`}
  & {
    .anticon-search {
      ${tw`absolute z-10 left-2`}
      color: #e2e8f0;
    }
    .ivnd-select-single .ivnd-select-selector .ivnd-select-selection-search {
      ${tw`left-7`}
    }
    .ivnd-select-single:not(.ivnd-select-customize-input)
      .ivnd-select-selector {
      ${tw`pl-7`}
    }
    .ivnd-select:not(.ivnd-select-customize-input) .ivnd-select-selector {
      color: #f1f5f9;
      background-color: #1e293b;
      border-color: #1e293b;
    }
    .ivnd-select-single:not(.ivnd-select-customize-input)
      .ivnd-select-selector
      .ivnd-select-selection-search-input {
      height: 28px;
    }
    .ivnd-select-selection-placeholder {
      color: #94a3b8;
    }
  }
`;

const SearchHotKey = styled.div`
  ${tw`z-10 -m-14 hover:cursor-pointer`}
  & {
    kbd {
      ${tw`inline-block text-xs font-bold tracking-tighter rounded-sm whitespace-nowrap py-0.5 px-1`}
      color: #cbd5e1;
      border: 1px solid #94a3b8;
    }
    kbd:hover {
      color: #e2e8f0;
      border-color: #cbd5e1;
    }
  }
`;

export { SearchContainer, SearchHotKey };
