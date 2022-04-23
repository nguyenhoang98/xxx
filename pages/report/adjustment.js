import { useState, useEffect, useRef } from 'react';
import reportApi from 'api/reportApi';
import { nanoid } from 'nanoid';
import { formatCurrency } from 'utils/common';
import PageTitle from 'components/PageTitle';
import { ReportContainer, ReportIframe } from 'components/Report/Report.styled';
import MakerFilter from 'components/Adjustment/MakerFilter';
import CheckerFilter from 'components/Adjustment/CheckerFilter';
import { useAuth } from 'contexts/auth-context';
import getConfig from 'next/config';
import {
  Button,
  Table,
  Card,
  Pagination,
  message,
  Modal,
  Divider,
  Space
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { publicRuntimeConfig } = getConfig();

const generateErrorField = (text, fieldText, record) => {
  if (record.errorFields.includes(text)) {
    return <div style={{ backgroundColor: '#FECACA' }}>{fieldText}</div>;
  }
  return fieldText;
};

export default function Adjustment() {
  const [dataTable, setDataTable] = useState([]);
  const [totalElements, setTotalElements] = useState(1);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [loading, setLoading] = useState(false);
  const [statusAdjustment, setStatusAdjustment] = useState({
    requestStatus: '',
    valid: ''
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [textModal, setTextModal] = useState('');
  const [actionModal, setActionModal] = useState('');
  const actionRef = useRef(actionModal);
  const [reloadFlag, setReloadFlag] = useState(false);
  const { userInfo, token } = useAuth();

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50,
      align: 'center',
      render: (value, row, index) => page * pageSize + index + 1
    },
    {
      title: 'Hr code',
      dataIndex: 'hrCode',
      render: (hrCode, record) => {
        return generateErrorField('hrCode', hrCode, record);
      }
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role, record) => {
        return generateErrorField('role', role, record);
      }
    },
    {
      title: 'Jd',
      dataIndex: 'jobDescription',
      render: (jobDescription, record) => {
        return generateErrorField('jobDescription', jobDescription, record);
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      render: (title, record) => {
        return generateErrorField('title', title, record);
      }
    },
    {
      title: 'Department',
      dataIndex: 'departmentName',
      width: 100,
      render: (departmentName, record) => {
        return generateErrorField('departmentName', departmentName, record);
      }
    },
    {
      title: 'Account number',
      dataIndex: 'accountNumber',
      width: 100,
      render: (accountNumber, record) => {
        return generateErrorField('accountNumber', accountNumber, record);
      }
    },
    {
      title: 'Customer name',
      dataIndex: 'customerName',
      render: (customerName, record) => {
        return generateErrorField('customerName', customerName, record);
      }
    },
    {
      title: 'Careby name',
      dataIndex: 'careByName',
      render: (careByName, record) => {
        return generateErrorField('careByName', careByName, record);
      }
    },
    {
      title: 'Product',
      dataIndex: 'productCodes',
      render: (productCodes, record) => {
        return generateErrorField('productCodes', productCodes, record);
      }
    },
    {
      title: 'From date',
      dataIndex: 'fromDate',
      width: 100,
      render: (fromDate, record) => {
        return generateErrorField('fromDate', fromDate, record);
      }
    },
    {
      title: 'To date',
      dataIndex: 'toDate',
      render: (toDate, record) => {
        return generateErrorField('toDate', toDate, record);
      }
    },
    {
      title: 'Sum derivative match quantity',
      dataIndex: 'matchQuantity',
      align: 'right',
      width: 150,
      render: (matchQuantity, record) => {
        return formatCurrency(
          generateErrorField('matchQuantity', matchQuantity, record)
        );
      }
    },
    {
      title: 'Sum derivative trading fee',
      dataIndex: 'tradingFee',
      align: 'right',
      width: 150,
      render: (tradingFee, record) => {
        return formatCurrency(
          generateErrorField('tradingFee', tradingFee, record)
        );
      }
    },
    {
      title: 'Note',
      dataIndex: 'note',
      width: 200
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100
    }
  ];

  const notificationStatus = data => {
    const requestStatusActions = {
      REJECTED: () =>
        message.info('Dữ liệu điều chỉnh không đúng. Vui lòng upload lại!'),
      IMPORTED: () =>
        data.valid
          ? message.info('Dữ liệu điều chỉnh đã được tải lên')
          : message.info(
              'Dữ liệu import có thông tin chưa chính xác, vui lòng kiểm tra lại dữ liệu'
            ),
      PENDING: () => message.info('Dữ liệu điều chỉnh đang chờ duyệt')
    };

    return requestStatusActions[data.requestStatus]();
  };

  const getDataAdjustment = async () => {
    let response = {};
    const payload = { page, pageSize };

    if (userInfo.isMaker) {
      response = await reportApi.getAdjustmentRequestRevenueDataForMaker(
        payload
      );
      if (response.data.metadata) {
        notificationStatus(response.data.metadata);
        setStatusAdjustment(response.data.metadata);
      }
    }

    if (userInfo.isChecker) {
      response = await reportApi.getAdjustmentRequestRevenueDataForChecker(
        payload
      );
    }

    setDataTable(response.data.content);
    response.data.totalElements
      ? setTotalElements(response.data.totalElements)
      : setTotalElements(1);
  };

  const writeDataAdjustment = async () => {
    await reportApi.confirmAdjustmentRequestRevenueForMaker();
  };

  const rejectDataAdjustment = async () => {
    await reportApi.rejectAdjustmentRequestRevenueForChecker();
    message.info('Từ chối dữ liệu điều chỉnh thành công');
  };

  const approveDataAdjustment = async () => {
    await reportApi.approveAdjustmentRequestRevenueForChecker();
    message.success(
      'Hoàn thành việc tính toán lại hoa hồng theo dữ liệu điều chỉnh'
    );
  };

  const handleConfirmModal = async () => {
    setLoading(true);
    const actionModals = {
      write: () => writeDataAdjustment(),
      reject: () => rejectDataAdjustment(),
      approve: () => approveDataAdjustment()
    };
    await actionModals[actionRef.current]();
    setIsModalVisible(false);
    setLoading(false);
    getDataAdjustment();
  };

  const generateTextModal = () => {
    const actionTexts = {
      write: 'GHI',
      reject: 'TỪ CHỐI',
      approve: 'DUYỆT'
    };
    setTextModal(actionTexts[actionRef.current]);
  };

  const openModal = param => {
    actionRef.current = param;
    generateTextModal();
    setIsModalVisible(true);
  };

  const onExportExcel = exportExcelApi => {
    window.open(
      `${publicRuntimeConfig.REACT_APP_API_URL}/${exportExcelApi}?token-id=${token}`,
      '_blank'
    );
  };

  const downloadAdjustmentFile = () => {
    let exportAdjustmentFileApi;
    if (userInfo.isMaker)
      exportAdjustmentFileApi = 'adjustment-request-revenue/files';
    if (userInfo.isChecker)
      exportAdjustmentFileApi = 'adjustment-request-revenue/pending-data/files';
    onExportExcel(exportAdjustmentFileApi);
  };

  const handlePageChange = value => {
    setPage(value - 1);
  };

  useEffect(() => {
    getDataAdjustment();
  }, [page, reloadFlag]);

  return (
    <ReportContainer>
      <div className="p-2 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <PageTitle />
          </div>
        </div>
        <Divider className="my-2" />
        {userInfo.isMaker && (
          <MakerFilter
            loading={loading}
            pageSize={pageSize}
            reloadFlag={reloadFlag}
            setReloadFlag={setReloadFlag}
            setLoading={setLoading}
            exportExcel={onExportExcel}
            statusAdjustment={statusAdjustment}
          />
        )}
        {userInfo.isChecker && <CheckerFilter exportExcel={onExportExcel} />}
      </div>
      <ReportIframe>
        <Card className="w-full">
          <Pagination
            showSizeChanger={false}
            defaultPageSize={pageSize}
            total={totalElements}
            className="flex justify-end my-2"
            onChange={handlePageChange}
          />
          <Table
            dataSource={dataTable}
            columns={columns}
            pagination={false}
            loading={loading}
            rowKey={() => nanoid()}
            scroll={{ x: 'max-content' }}
          />
          <div className="flex justify-end my-4">
            <Space>
              <Button onClick={() => downloadAdjustmentFile()} className="w-28">
                Kết xuất
              </Button>
              {userInfo.isMaker && (
                <Button
                  type="primary"
                  onClick={() => openModal('write')}
                  disabled={
                    statusAdjustment.requestStatus === 'PENDING' ||
                    !statusAdjustment.valid
                  }
                  loading={loading}
                  className="w-28"
                >
                  Ghi
                </Button>
              )}
              {userInfo.isChecker && (
                <>
                  <Button
                    icon={<CloseCircleOutlined />}
                    type="danger"
                    onClick={() => openModal('reject')}
                    loading={loading}
                    className="w-28"
                    disabled={dataTable.length === 0}
                  >
                    Từ chối
                  </Button>

                  <Button
                    icon={<CheckCircleOutlined />}
                    type="primary"
                    onClick={() => openModal('approve')}
                    loading={loading}
                    className="w-28"
                    disabled={dataTable.length === 0}
                  >
                    Duyệt
                  </Button>
                </>
              )}
            </Space>
          </div>
        </Card>
      </ReportIframe>

      <Modal
        title={`${textModal} FILE IMPORT DỮ LIỆU`}
        visible={isModalVisible}
        centered
        footer={[
          <Button
            key="back"
            type="text"
            className="text-yellow-500"
            onClick={() => setIsModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleConfirmModal}
          >
            OK
          </Button>
        ]}
      >
        <p>{`Xác nhận ${textModal} file import dữ liệu`}</p>
      </Modal>
    </ReportContainer>
  );
}
