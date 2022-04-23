import React, { useState } from 'react';
import dayjs from 'dayjs';
import productApi from 'api/productApi';
import FormCategory from 'components/Product/FormCategory';
import { ReportContainer, ReportIframe } from 'components/Report/Report.styled';
import {
  useList,
  ListingTable,
  ListingFormActions,
  ListingOptionCategoryStatuses,
  ListingOptionCategoryCreators
} from 'components/Listing';
import { useAuth } from 'contexts/auth-context';
import generateTag from 'utils/generateTag';
import { EditOutlined } from '@ant-design/icons';
import {
  DatePicker,
  Form,
  Row,
  Col,
  Card,
  Divider,
  Tooltip,
  Space,
  Input,
  message
} from 'antd';
import PageTitle from 'components/PageTitle';

export default function Product() {
  const {
    formList,
    onResetForm,
    pageNum,
    pageSize,
    onSubmitForm,
    onPageChange,
    payload
  } = useList();
  const { userInfo } = useAuth();
  const [formCategory] = Form.useForm();
  const [categorySelected, setCategorySelected] = useState(null);
  const [categoryAction, setCategoryAction] = useState('ADD');

  const { data: dataTable, error, mutate } = productApi.getSearchCategory(
    payload
  );
  const tableLoading = !error && !dataTable;

  const editCategory = category => {
    setCategorySelected(category);
    setCategoryAction('EDIT');
    formCategory.setFieldsValue({
      name: category.name,
      parentId: category.parentId
    });
  };

  const generateActionButton = record => {
    return (
      <>
        {userInfo.isChecker && (
          <Tooltip title="Chỉnh sửa" placement="bottom">
            <EditOutlined
              onClick={() => editCategory(record)}
              className="text-base cursor-pointer hover:text-yellow-500"
            />
          </Tooltip>
        )}
      </>
    );
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'right',
      width: 50,
      render: (value, row, index) => (pageNum - 1) * 10 + (index + 1)
    },
    {
      title: 'Product category',
      dataIndex: 'name',
      key: 'name',
      render: name => <span className="text-yellow-500">{name}</span>
    },
    {
      title: 'Parent product category',
      dataIndex: 'parentName',
      key: 'parentName',
      width: 160
    },
    {
      title: 'Create date',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: createdOn => dayjs(createdOn).format('DD-MM-YYYY')
    },
    {
      title: 'Creator',
      dataIndex: 'creator',
      key: 'creator'
    },
    {
      title: 'Status',
      dataIndex: 'statusName',
      key: 'statusName',
      render: (status, record) => <>{generateTag(record.status, record)}</>
    },
    {
      title: 'Action',
      dataIndex: 'action',
      fixed: 'right',
      width: 100,
      render: (action, record) => {
        return <Space size="middle">{generateActionButton(record)}</Space>;
      }
    }
  ];

  const clearForm = () => {
    setCategoryAction('ADD');
    setCategorySelected(null);
    formCategory.resetFields();
  };

  const createCategory = async categoryPayload => {
    await productApi.createCategory(categoryPayload);
    message.success('Thêm mới category thành công');
  };

  const updateCategory = async categoryPayload => {
    await productApi.updateCategory({
      ...categoryPayload,
      id: categorySelected.id
    });
    message.success('Cập nhật category thành công');
  };

  const submitCategory = async formValues => {
    categoryAction === 'ADD'
      ? await createCategory(formValues)
      : await updateCategory(formValues);

    mutate();
    clearForm();
  };

  return (
    <ReportContainer className="flex">
      <Form
        form={formList}
        onFinish={onSubmitForm}
        initialValues={{
          dateRange: '',
          size: 20,
          pageNum: 1
        }}
        className="w-3/4"
      >
        <div className="p-2 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PageTitle />
              <Form.Item name="dateRange">
                <DatePicker.RangePicker
                  onChange={onSubmitForm}
                  className="w-full"
                />
              </Form.Item>
            </div>
          </div>

          <Divider className="my-2" />

          <Row gutter={8}>
            <Col span={6}>
              <Form.Item name="keyword">
                <Input placeholder="Product category" className="w-full" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="creator">
                <ListingOptionCategoryCreators queryList={onSubmitForm} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status">
                <ListingOptionCategoryStatuses queryList={onSubmitForm} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <ListingFormActions onResetForm={onResetForm} />
            </Col>
          </Row>
        </div>
        <ReportIframe>
          <Card className="h-full -mr-2">
            <ListingTable
              columns={columns}
              pageSize={pageSize}
              pageNum={pageNum}
              totalElements={dataTable?.totalElements}
              onPageChange={onPageChange}
              tableLoading={tableLoading}
              dataTable={dataTable?.content}
            />
          </Card>
        </ReportIframe>
      </Form>

      <FormCategory
        formCategory={formCategory}
        categoryAction={categoryAction}
        clearForm={clearForm}
        submitCategory={submitCategory}
      />
    </ReportContainer>
  );
}
