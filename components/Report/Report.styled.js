import styled from 'styled-components';
import tw from 'twin.macro';

const ReportContainer = styled.div`
  & {
    .ivnd-form-item {
      ${tw`m-0`}
    }
  }
`;

const ReportIframe = styled.div`
  ${tw`m-2`}
  & {
    .ivnd-card-body {
      ${tw`px-4 py-0`}
    }
    .ivnd-pagination {
      ${tw`flex justify-end my-4`}
    }
    .ivnd-iframe {
      ${tw`w-full border-none`}
      height: calc(100vh - 170px)
    }
    .ivnd-skeleton-paragraph li {
      ${tw`h-5 mt-2`}
    }
    .ivnd-skeleton-paragraph li + li {
      ${tw`my-6`}
    }
  }
`;

const ReportFormButton = styled.div`
  & {
    .ivnd-form-item-control-input-content {
      ${tw`flex justify-end`}
    }
  }
`;

export { ReportContainer, ReportIframe, ReportFormButton };
