import React from 'react';
import PolicyStepOnePreview from 'components/Policy/PolicyStepOnePreview';
import PolicyStepTwoPreview from 'components/Policy/PolicyStepTwoPreview';
import PolicyStepThreePreview from 'components/Policy/PolicyStepThreePreview';
import policyApi from 'api/policyApi';
import { Modal } from 'antd';

function PolicyViewDetailsModal({
  policyDetails,
  closeViewPolicyDetailsModal
}) {
  const { data: policyData } = policyApi.getPolicyById(policyDetails.data?.id);
  if (!policyData) return false;

  return (
    <Modal
      title={`Policy Details - ${policyDetails.data?.code}`}
      visible={policyDetails.visible}
      okButtonProps={{ style: { display: 'none' } }}
      onCancel={closeViewPolicyDetailsModal}
      cancelText="Close"
      width={720}
      className="top-12"
    >
      <PolicyStepOnePreview formStepOne={policyData} />
      <PolicyStepTwoPreview formStepTwo={policyData} />
      <PolicyStepThreePreview formStepThree={policyData} />
    </Modal>
  );
}

export default React.memo(PolicyViewDetailsModal);
