import React from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import PageTitle from 'components/PageTitle';
import {
  useList,
  ListingTable,
  ListingFormActions,
  ListingOptionProductTypes,
  ListingOptionProductStatuses,
  ListingOptionProductCategories
} from 'components/Listing';
import { useAuth } from 'contexts/auth-context';
import generateTag from 'utils/generateTag';
import { ReportContainer, ReportIframe } from 'components/Report/Report.styled';
import productApi from 'api/productApi';
import {
  Divider,
  Row,
  Col,
  Form,
  Input,
  Button,
  Card,
  DatePicker,
  Space,
  message,
  Tooltip,
  Popconfirm
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckSquareOutlined,
  StopOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';

export default function ListProduct() {
  const {
    formList,
    onResetForm,
    pageNum,
    pageSize,
    onSubmitForm,
    onPageChange,
    payload
  } = useList();
  const router = useRouter();
  const { userInfo } = useAuth();

  const { data: dataTable, error, mutate } = productApi.getSearchProduct(
    payload
  );
  const tableLoading = !error && !dataTable;

  const deleteProduct = id => {
    productApi.deleteProductById(id).then(() => {
      message.success('Xóa thành công');
      mutate();
    });
  };

  const deactivateProduct = id => {
    productApi.deactivateProductById(id).then(() => {
      message.success('Dừng hoạt động thành công');
      mutate();
    });
  };

  const approveProduct = id => {
    productApi.approveProductById(id).then(() => {
      message.success('Phê duyệt thành công');
      mutate();
    });
  };

  const buttonPending = id => {
    return (
      <>
        <Tooltip title="Chỉnh sửa" placement="bottom">
          <EditOutlined
            onClick={() => router.push(`/product/create?id=${id}`)}
            className="text-base cursor-pointer hover:text-yellow-500"
          />
        </Tooltip>
        {userInfo.isMaker && (
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => deleteProduct(id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa" placement="bottom">
              <DeleteOutlined className="text-base cursor-pointer hover:text-yellow-500" />
            </Tooltip>
          </Popconfirm>
        )}
        {userInfo.isChecker && (
          <Popconfirm
            title="Bạn có chắc chắn muốn duyệt sản phẩm này?"
            onConfirm={() => approveProduct(id)}
            okText="Duyệt"
            cancelText="Hủy"
          >
            <Tooltip title="Phê duyệt" placement="bottom">
              <CheckSquareOutlined className="text-base cursor-pointer hover:text-yellow-500" />
            </Tooltip>
          </Popconfirm>
        )}
      </>
    );
  };

  const buttonActivated = id => {
    return (
      <>
        <Tooltip title="Chỉnh sửa" placement="bottom">
          <EditOutlined
            onClick={() => router.push(`/product/create?id=${id}`)}
            className="text-base cursor-pointer hover:text-yellow-500"
          />
        </Tooltip>
        <Popconfirm
          title="Bạn có chắc chắn muốn dừng sản phẩm này?"
          onConfirm={() => deactivateProduct(id)}
          okText="Dừng"
          cancelText="Hủy"
        >
          <Tooltip title="Dừng hoạt động" placement="bottom">
            <StopOutlined className="text-base cursor-pointer hover:text-yellow-500" />
          </Tooltip>
        </Popconfirm>
      </>
    );
  };
  const buttonDeactivatedRefused = id => {
    return (
      <>
        <Tooltip title="Chỉnh sửa" placement="bottom">
          <EditOutlined
            onClick={() => router.push(`/product/create?id=${id}`)}
            className="text-base cursor-pointer hover:text-yellow-500"
          />
        </Tooltip>
      </>
    );
  };

  const generateActionButton = ({ status, id }) => {
    const actionButtons = {
      PENDING: () => buttonPending(id),
      ACTIVATED: () => buttonActivated(id),
      DEACTIVATED: () => buttonDeactivatedRefused(id),
      REFUSED: () => buttonDeactivatedRefused(id)
    };
    return actionButtons[status](id);
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
      title: 'Code product',
      dataIndex: 'code',
      key: 'code',
      render: code => <span className="text-yellow-500">{code}</span>
    },
    {
      title: 'Name product',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Product type',
      dataIndex: 'typeName',
      key: 'typeName'
    },
    {
      title: 'Product category',
      dataIndex: 'categoryNames',
      key: 'categoryNames',
      width: 160
    },
    {
      title: 'Created time',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: createdOn => dayjs(createdOn).format('DD-MM-YYYY')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => <>{generateTag(status, record)}</>
    },
    {
      title: 'Creator',
      dataIndex: 'createdBy',
      key: 'createdBy'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      fixed: 'right',
      render: (_, record) => {
        return <Space size="middle">{generateActionButton(record)}</Space>;
      }
    }
  ];

  return (
    <ReportContainer>
      <Form
        form={formList}
        name="formList"
        onFinish={onSubmitForm}
        initialValues={{
          dateRange: '',
          size: 20,
          pageNum: 1
        }}
      >
        <div className="p-2 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PageTitle />
              <Form.Item name="dateRange">
                <DatePicker.RangePicker
                  onChange={onSubmitForm}
                  style={{
                    width: '100%'
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <Divider className="my-2" />
          <Row gutter={8}>
            <Col span={5}>
              <Form.Item name="keyword">
                <Input placeholder="Search name/code" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="type">
                <ListingOptionProductTypes queryList={onSubmitForm} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="categoryIds">
                <ListingOptionProductCategories queryList={onSubmitForm} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="productStatus">
                <ListingOptionProductStatuses queryList={onSubmitForm} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <ListingFormActions onResetForm={onResetForm} />
            </Col>
          </Row>
        </div>
        <ReportIframe>
          <Card className="h-full">
            {userInfo.isMaker && (
              <div className="absolute z-10 top-4">
                <Button
                  icon={<PlusCircleOutlined />}
                  onClick={() => router.push(`/product/create`)}
                >
                  Create product
                </Button>
              </div>
            )}
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
    </ReportContainer>
  );
}
