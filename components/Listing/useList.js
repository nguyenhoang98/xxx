import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Form } from 'antd';

export default function useList() {
  const [formList] = Form.useForm();
  const [payload, setPayload] = useState();
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(20);

  const onSubmitForm = () => {
    const formValues = formList.getFieldsValue();
    const fromDate =
      formValues?.dateRange?.length > 0
        ? dayjs(formValues.dateRange[0]).valueOf()
        : '';
    const toDate =
      formValues?.dateRange?.length > 0
        ? dayjs(formValues.dateRange[1]).valueOf()
        : '';

    const tmpPayload = {
      ...formValues,
      fromDate,
      toDate,
      size: pageSize,
      page: pageNum - 1
    };
    delete tmpPayload.dateRange;

    setPayload(tmpPayload);
  };

  const onResetForm = () => {
    formList.resetFields();
    formList.submit();
  };

  const onPageChange = page => {
    setPageNum(page);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    formList.submit();
  }, [pageNum]);

  return {
    formList,
    onResetForm,
    pageNum,
    pageSize,
    onSubmitForm,
    onPageChange,
    payload
  };
}
