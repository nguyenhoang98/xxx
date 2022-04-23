import { useEffect } from "react";
import useReport from "components/Report";
import PageTitle from "components/PageTitle";
import { ListingFormActions } from "components/Listing";
import { ReportContainer, ReportIframe } from "components/Report/Report.styled";
import { Divider, Row, Col, Form, Input, Button, Select, Spin } from "antd";
import { FileExcelOutlined, LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function ReportCommission() {
  const {
    formReport,
    setReportSrc,
    listStagePeriod,
    onSubmitForm,
    reportQueryObject,
    onResetForm,
    onExportExcel,
    reportLoading,
    hideReportLoading,
  } = useReport();
  const { iframeSrc } = reportQueryObject;

  useEffect(() => {
    setReportSrc("/dor/commission-report/admin-view");
  }, []);
  function abc() {
    console.log("abc");
  }

  return (
    <ReportContainer>
      <Form
        form={formReport}
        name="Commission Report"
        onFinish={onSubmitForm}
        initialValues={{
          periodPicker: [],
          department: "",
          careByName: "",
          position: "",
          hrCode: "",
        }}
      >
        <div className="p-2 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PageTitle />
              <Form.Item name="periodPicker" style={{ width: 250 }}>
                <Select placeholder="Chọn kỳ báo cáo" onChange={onSubmitForm}>
                  {listStagePeriod &&
                    listStagePeriod.map((item, index) => {
                      console.log(item);
                      return (
                        <Option
                          key={index}
                          value={[`${item.fromDate} - ${item.toDate}`]}
                        >{`${item.fromDate} - ${item.toDate}`}</Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </div>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              style={{ width: "7.5rem" }}
              className={
                listStagePeriod?.length === 0
                  ? ""
                  : "bg-green-500 border-green-500 hover:bg-green-400 hover:border-green-400"
              }
              onClick={onExportExcel}
              disabled={listStagePeriod?.length === 0}
            >
              Xuất Excel
            </Button>
          </div>
          <Divider className="my-2" />
          <Row gutter={8}>
            <Col span={5}>
              <Form.Item name="department">
                <Input placeholder="Phòng môi giới" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="careByName">
                <Input placeholder="Tên môi giới" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="hrCode">
                <Input placeholder="Mã nhân viên" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="position">
                <Input placeholder="Chức vụ" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <ListingFormActions
                onResetForm={onResetForm}
                disabled={listStagePeriod?.length === 0}
              />
            </Col>
          </Row>
        </div>
      </Form>
      <ReportIframe>
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: "2rem" }} spin />}
          spinning={reportLoading}
        >
          <iframe
            src={iframeSrc}
            title="Commission Report"
            className="ivnd-iframe"
            onLoad={hideReportLoading}
          />
        </Spin>
      </ReportIframe>
    </ReportContainer>
  );
}
