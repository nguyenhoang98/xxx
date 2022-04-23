import { useState, useEffect } from "react";
import reportApi from "api/reportApi";
import { useAuth } from "contexts/auth-context";
import queryString from "query-string";
import { Form } from "antd";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export default function useReport() {
  const [formReport] = Form.useForm();
  const [reportSrc, setReportSrc] = useState();
  const [reportQueryObject, setReportQueryObject] = useState({
    payload: {},
    iframeSrc: "",
  });
  const [reportLoading, setReportLoading] = useState(true);
  const pageSize = 20;

  const { token } = useAuth();

  const { data: listStagePeriod } = reportApi.getStagePeriodReport({
    "token-id": token,
  });
  console.log(listStagePeriod);
  const hideReportLoading = () => {
    setReportLoading(false);
  };

  const onSubmitForm = () => {
    setReportLoading(true);
    window.localStorage.setItem("pageNum", 1);
    const formValues = formReport.getFieldsValue();
    console.log(formValues);
    const periodDate = formValues.periodPicker[0].split(" - ");
    console.log(periodDate);
    const fromDate = periodDate[0];
    const toDate = periodDate[1];
    const payload = {
      ...formValues,
      fromDate,
      toDate,
      pageSize,
      "token-id": token,
    };
    delete payload.periodPicker;
    console.log(payload);
    console.log(`${reportSrc}?${queryString.stringify(payload)}`);
    const iframeSrc = `${reportSrc}?${queryString.stringify(payload)}`;

    reportQueryObject.iframeSrc === iframeSrc
      ? setReportLoading(false)
      : setReportQueryObject({
          payload,
          iframeSrc,
        });
  };

  useEffect(() => {
    if (!listStagePeriod || !reportSrc) return;

    formReport.setFieldsValue({
      periodPicker: [
        `${listStagePeriod[0].fromDate} - ${listStagePeriod[0].toDate}`,
      ],
    });

    onSubmitForm();
  }, [listStagePeriod, reportSrc]);

  const onResetForm = () => {
    formReport.resetFields();
    formReport.setFieldsValue({
      periodPicker: [
        `${listStagePeriod[0].fromDate} - ${listStagePeriod[0].toDate}`,
      ],
    });
    formReport.submit();
  };

  const onExportExcel = () => {
    const exportExcelApi = `${reportSrc}/export?${queryString.stringify(
      reportQueryObject.payload
    )}`;

    window.open(
      `${publicRuntimeConfig.REACT_APP_DOR_URL}${exportExcelApi}`,
      "_blank"
    );
  };

  return {
    formReport,
    setReportSrc,
    listStagePeriod,
    reportQueryObject,
    onSubmitForm,
    onResetForm,
    onExportExcel,
    reportLoading,
    hideReportLoading,
  };
}
