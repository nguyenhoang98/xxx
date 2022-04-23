import React, { useState } from 'react';
import policyApi from 'api/policyApi';
import { nanoid } from 'nanoid';
import {
  Row,
  Col,
  Table,
  Checkbox,
  Select,
  Form,
  Modal,
  Button,
  Tooltip,
  message
} from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Column } = Table;

function PolicyStepOneBeneficiaryCreateModal({
  isModalVisible,
  closeBeneficiaryCreateModal,
  setFormBeneficiaryItem
}) {
  const [form] = Form.useForm();
  const [disableSelectRole, setDisableSelectRole] = useState(false);
  const [disableSelectJD, setDisableSelectJD] = useState(false);
  const [disableSelectTitle, setDisableSelectTitle] = useState(false);
  const [disableSelectPos, setDisableSelectPos] = useState(true);
  const { data: optionRoles } = policyApi.getAllBeneficiaryRoles();
  const {
    data: optionJobDescriptions
  } = policyApi.getAllBeneficiaryJobDescriptions();
  const { data: optionTitles } = policyApi.getAllBeneficiaryTitles();
  const { data: optionPos } = policyApi.getAllBeneficiaryPos();
  const {
    data: optionCertificates
  } = policyApi.getAllBeneficiaryCertificates();

  const mapPayloadValue = items => {
    return items.map(({ key, label }) => {
      return { code: key, name: label };
    });
  };

  const onCreateBeneficiary = () => {
    const payload = form.getFieldsValue();

    payload.certificates = payload.certificates.map(
      ({ certificate, required }) => {
        return {
          code: certificate.key,
          name: certificate.label,
          required
        };
      }
    );

    payload.roles = mapPayloadValue(payload.roles);
    payload.jobDescriptions = mapPayloadValue(payload.jobDescriptions);
    payload.titles = mapPayloadValue(payload.titles);
    payload.pos = mapPayloadValue(payload.pos);

    policyApi
      .createBeneficiary(payload)
      .then(({ data }) => {
        message.success('Create beneficiary successfully!');
        setFormBeneficiaryItem(data);
        form.resetFields();
        closeBeneficiaryCreateModal();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const onChangeRole = e => {
    setDisableSelectRole(e.target.checked);
  };

  const onChangeJD = e => {
    setDisableSelectJD(e.target.checked);
  };

  const onChangeTitle = e => {
    setDisableSelectTitle(e.target.checked);
  };

  const onChangePos = e => {
    setDisableSelectPos(e.target.checked);
  };

  return (
    <Modal
      title="Create beneficiary"
      visible={isModalVisible}
      onOk={onCreateBeneficiary}
      okText="Create"
      onCancel={closeBeneficiaryCreateModal}
      width={720}
      className="top-12"
    >
      <Form
        form={form}
        colon={false}
        layout="vertical"
        initialValues={{
          allRole: false,
          roles: [],
          allJobDescription: false,
          jobDescriptions: [],
          allTitle: false,
          titles: [],
          allPos: true,
          pos: [],
          certificates: []
        }}
      >
        <Row gutter={[12, 0]}>
          <Col span={12}>
            <div className="ivnd-col ivnd-form-item-label">
              <span className="ivnd-form-item-no-colon">Role</span>
            </div>
            <Row gutter={[6, 0]}>
              <Col span={5}>
                <Form.Item name="allRole" valuePropName="checked">
                  <Checkbox
                    onChange={onChangeRole}
                    className="w-full py-1 pl-2 rounded bg-gray-50 hover:bg-yellow-50"
                  >
                    All
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col span={19}>
                <Form.Item name="roles">
                  <Select
                    mode="tags"
                    maxTagCount="responsive"
                    labelInValue
                    className="w-full"
                    disabled={disableSelectRole}
                  >
                    {optionRoles &&
                      optionRoles.map(({ code }) => (
                        <Option key={code} value={code}>
                          {code}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <div className="ivnd-col ivnd-form-item-label">
              <span className="ivnd-form-item-no-colon">Job description</span>
            </div>
            <Row gutter={[6, 0]}>
              <Col span={5}>
                <Form.Item name="allJobDescription" valuePropName="checked">
                  <Checkbox
                    onChange={onChangeJD}
                    className="w-full py-1 pl-2 rounded bg-gray-50 hover:bg-yellow-50"
                  >
                    All
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col span={19}>
                <Form.Item name="jobDescriptions">
                  <Select
                    mode="tags"
                    maxTagCount="responsive"
                    labelInValue
                    className="w-full"
                    disabled={disableSelectJD}
                  >
                    {optionJobDescriptions &&
                      optionJobDescriptions.map(({ code }) => (
                        <Option key={code} value={code}>
                          {code}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={[12, 0]}>
          <Col span={12}>
            <div className="ivnd-col ivnd-form-item-label">
              <span className="ivnd-form-item-no-colon">Title</span>
            </div>
            <Row gutter={[6, 0]}>
              <Col span={5}>
                <Form.Item name="allTitle" valuePropName="checked">
                  <Checkbox
                    onChange={onChangeTitle}
                    className="w-full py-1 pl-2 rounded bg-gray-50 hover:bg-yellow-50"
                  >
                    All
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col span={19}>
                <Form.Item name="titles">
                  <Select
                    mode="tags"
                    maxTagCount="responsive"
                    labelInValue
                    className="w-full"
                    disabled={disableSelectTitle}
                  >
                    {optionTitles &&
                      optionTitles.map(({ code }) => (
                        <Option key={code} value={code}>
                          {code}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <div className="ivnd-col ivnd-form-item-label">
              <span className="ivnd-form-item-no-colon">POS</span>
            </div>
            <Row gutter={[6, 0]}>
              <Col span={5}>
                <Form.Item name="allPos" valuePropName="checked">
                  <Checkbox
                    onChange={onChangePos}
                    className="w-full py-1 pl-2 rounded bg-gray-50 hover:bg-yellow-50"
                  >
                    All
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col span={19}>
                <Form.Item name="pos">
                  <Select
                    mode="tags"
                    maxTagCount="responsive"
                    labelInValue
                    className="w-full"
                    disabled={disableSelectPos}
                  >
                    {optionPos &&
                      optionPos.map(({ code, name }) => (
                        <Option key={code} value={code}>
                          {name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Form.List name="certificates">
          {(fields, { add, remove, rowKey }) => (
            <>
              <Table
                dataSource={form.getFieldValue('certificates')}
                pagination={false}
                size="small"
                rowKey={() => nanoid()}
              >
                <Column
                  dataIndex="certificate"
                  key="certificate"
                  title="Job certificate"
                  render={(text, record, index) => (
                    <Form.Item
                      name={[index, 'certificate']}
                      fieldKey={[index, 'certificate']}
                      className="mb-0"
                    >
                      <Select labelInValue className="w-full">
                        {optionCertificates &&
                          optionCertificates.map(({ code, name }) => (
                            <Option key={code} value={code}>
                              {name}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  )}
                />

                <Column
                  dataIndex="required"
                  key="required"
                  title="Required"
                  width="20%"
                  render={(text, record, index) => (
                    <Form.Item
                      name={[index, 'required']}
                      fieldKey={[index, 'required']}
                      className="mb-0"
                    >
                      <Select className="w-full">
                        <Option value>Yes</Option>
                        <Option value={false}>No</Option>
                      </Select>
                    </Form.Item>
                  )}
                />

                <Column
                  key={rowKey}
                  width={40}
                  render={(text, record, index) => (
                    <Tooltip title="Remove product">
                      <Button
                        shape="circle"
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={() => remove(index)}
                      />
                    </Tooltip>
                  )}
                />
              </Table>
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      certificate: {
                        key: optionCertificates[0].key,
                        value: optionCertificates[0].key,
                        label: optionCertificates[0].value
                      },
                      required: true
                    })}
                  block
                  icon={<PlusOutlined />}
                  className="w-full"
                >
                  Add certificate
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}

export default React.memo(PolicyStepOneBeneficiaryCreateModal);
