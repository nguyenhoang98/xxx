import { useState } from 'react';
import { Upload, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function PolicyStepFourDocument() {
  const [fileUpload, setFileUpload] = useState([]);

  const handleChange = ({ fileList }) => setFileUpload(fileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Title level={4} type="warning" className="mt-6">
        6. Documents
      </Title>
      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileUpload}
        onChange={handleChange}
      >
        {fileUpload.length >= 8 ? null : uploadButton}
      </Upload>
    </>
  );
}
