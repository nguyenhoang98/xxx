import React from 'react';
import { ListingOptionProductCategories } from 'components/Listing';
import { Form, Input, Button, Space } from 'antd';

export default function FormCategory({
  formCategory,
  categoryAction,
  clearForm,
  submitCategory
}) {
  const formItemLayout = {
    wrapperCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 24
      }
    }
  };

  return (
    <Form
      form={formCategory}
      {...formItemLayout}
      onFinish={submitCategory}
      className="w-1/4 p-2"
      layout="vertical"
    >
      <h1 className="mb-6 text-xl font-normal tracking-tight text-yellow-500">
        Create new product category
      </h1>
      <Form.Item name="name" label="Category name" className="mb-4">
        <Input placeholder="Tên nhóm sản phẩm" />
      </Form.Item>
      <Form.Item name="parentId" label="Parent category name" className="mb-4">
        <ListingOptionProductCategories categoryAction={categoryAction} />
      </Form.Item>
      <Form.Item>
        <Space className="flex justify-end">
          <Button onClick={clearForm} type="text" className="text-yellow-500">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" className="w-20">
            {categoryAction === 'ADD' ? 'Create' : 'Edit'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
