import React, { useState, useCallback } from 'react';
import dayjs from 'dayjs';
import policyApi from 'api/policyApi';
import PageTitle from 'components/PageTitle';
import {
  useList,
  ListingTable,
  ListingFormActions,
  ListingOptionPolicyTypes,
  ListingOptionPolicyStatuses
} from 'components/Listing';
import { useAuth } from 'contexts/auth-context';
import generateTag from 'utils/generateTag';
import PolicyViewDetailsModal from 'components/Policy/PolicyViewDetailsModal';
import { ReportContainer, ReportIframe } from 'components/Report/Report.styled';
import {
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  DatePicker,
  Space,
  Tooltip,
  Popconfirm,
  Typography
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckSquareOutlined,
  StopOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Link } = Typography;

export default function ListPolicy() {
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

  const {
    data: dataTable,
    error,
    mutate
  } = policyApi.getSearchPolicyByBeneficiary(payload);
  const tableLoading = !error && !dataTable;

  const [policyDetails, setPolicyDetails] = useState({
    visible: false,
    data: null
  });

  const openViewPolicyDetailsModal = record => {
    setPolicyDetails({ visible: true, data: record });
  };

  const closeViewPolicyDetailsModal = useCallback(() => {
    setPolicyDetails({ visible: false, data: null });
  }, []);

  const approvalPolicy = id => {
    policyApi.approvalPolicyById(id).then(() => {
      message.success(`Phê duyệt thành công`);
      mutate();
    });
  };

  const deletePolicy = id => {
    policyApi.deletePolicyById(id).then(() => {
      message.success('Xóa thành công');
      mutate();
    });
  };

  const deactivatePolicy = id => {
    policyApi.deactivatePolicyById(id).then(() => {
      message.success('Dừng hoạt động thành công');
      mutate();
    });
  };

  const buttonPending = id => {
    return (
      <>
        <Tooltip title="Chỉnh sửa" placement="bottom">
          <EditOutlined className="text-base cursor-pointer hover:text-yellow-500" />
        </Tooltip>
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa chính sách này?"
          onConfirm={() => deletePolicy(id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Tooltip title="Xóa" placement="bottom">
            <DeleteOutlined className="text-base cursor-pointer hover:text-yellow-500" />
          </Tooltip>
        </Popconfirm>
        {userInfo.isChecker && (
          <Popconfirm
            title="Bạn có chắc chắn phê duyệt chính sách này?"
            onConfirm={() => approvalPolicy(id)}
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
          <EditOutlined className="text-base cursor-pointer hover:text-yellow-500" />
        </Tooltip>
        <Popconfirm
          title="Bạn có chắc chắn muốn dừng chính sách này?"
          onConfirm={() => deactivatePolicy(id)}
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
  const buttonDeactivatedRefused = () => {
    return (
      <>
        <Tooltip title="Chỉnh sửa" placement="bottom">
          <EditOutlined className="text-base cursor-pointer hover:text-yellow-500" />
        </Tooltip>
      </>
    );
  };

  const generateActionButton = ({ status, id }) => {
    const actionButtons = {
      PENDING: () => buttonPending(id),
      ACTIVATED: () => buttonActivated(id),
      DEACTIVATED: () => buttonDeactivatedRefused(),
      REFUSED: () => buttonDeactivatedRefused()
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
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (_, record) => (
        <Link onClick={() => openViewPolicyDetailsModal(record)}>
          {record.code}
        </Link>
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 160
    },
    {
      title: 'Policy type',
      dataIndex: 'typeName',
      key: 'typeName'
    },
    {
      title: 'Beneficiary (Role, JD, Title, POS, Certificate)',
      dataIndex: 'beneficiary',
      key: 'beneficiary',
      width: 200,
      render: beneficiary => beneficiary?.fullText
    },
    {
      title: 'Effect Date',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      render: effectiveDate => dayjs(effectiveDate).format('DD-MM-YYYY')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => <>{generateTag(status, record)}</>
    },
    {
      title: 'Expire Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: expiryDate => dayjs(expiryDate).format('DD-MM-YYYY')
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
    <>
      <ReportContainer>
        <Form
          form={formList}
          name="formList"
          onFinish={onSubmitForm}
          initialValues={{
            keyword: '',
            dateType: 'EFFECTIVE_DATE',
            beneficiary: '',
            dateRange: '',
            pageNum: 1
          }}
        >
          <div className="p-2 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <PageTitle />
                <Form.Item name="dateRange" className="mr-2">
                  <DatePicker.RangePicker onChange={onSubmitForm} />
                </Form.Item>
                <Form.Item name="dateType">
                  <Select onChange={onSubmitForm}>
                    <Option value="EFFECTIVE_DATE">Effective date</Option>
                    <Option value="EXPIRY_DATE">Expiry date</Option>
                  </Select>
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
              <Col span={5}>
                <Form.Item name="beneficiary">
                  <Input placeholder="Search beneficiary" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="type">
                  <ListingOptionPolicyTypes queryList={onSubmitForm} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="status">
                  <ListingOptionPolicyStatuses queryList={onSubmitForm} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <ListingFormActions onResetForm={onResetForm} />
              </Col>
            </Row>
          </div>
          <ReportIframe>
            <Card className="h-full">
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

      <PolicyViewDetailsModal
        policyDetails={policyDetails}
        closeViewPolicyDetailsModal={closeViewPolicyDetailsModal}
      />
    </>
  );
}
