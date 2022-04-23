import React, { useEffect, useState } from 'react';
import {
  ListingOptionProductTypes,
  ListingOptionProductCategories
} from 'components/Listing';
import { Button, Divider, Form, Input, Card, Space, Typography } from 'antd';
import { useRouter } from 'next/router';
import productApi from 'api/productApi';
import { getRouteInfo } from 'api/menuRoutes';

const { Title } = Typography;

export default function CreateProduct() {
  const router = useRouter();
  const routeData = getRouteInfo(router.route);
  const [formProduct] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { data: product } = productApi.getProductDetailById(router.query.id);
  useEffect(() => {
    if (product) {
      formProduct.setFieldsValue({
        name: product.name,
        type: {
          key: product.type,
          value: product.type,
          label: product.typeName
        },
        categories: product.categories.map(item => item.id)
      });
    }
  }, [product]);

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: 'Vui lòng điền ${label}!'
  };

  const submitForm = async formValues => {
    setLoading(true);
    const payload = {
      name: formValues.name,
      type: formValues.type.value,
      categories: formValues.categories
    };
    if (router.query.id) {
      payload.id = router.query.id;
      await productApi.updateProduct(payload);
    } else {
      await productApi.createProduct(payload);
    }
    setLoading(false);
    router.push(`/product/list`);
  };

  const onCancel = () => {
    router.push('/product/list');
  };

  return (
    <>
      <div className="flex p-3 bg-white">
        <div className="flex items-center justify-center px-3 py-1 mr-1 rounded-full bg-yellow-50">
          <span className="font-semibold">{routeData.code}</span>
        </div>
        <h1 className="mb-0 mr-6 text-xl font-normal tracking-tight text-gray-700">
          {router.query.id ? 'Edit product' : 'Create new product'}
        </h1>
      </div>
      <div className="flex justify-center">
        <Card className="w-full max-w-screen-md mt-2">
          <Title level={4} type="warning">
            1. Product information
          </Title>
          <Form
            labelCol={{ span: 7 }}
            form={formProduct}
            name="formProduct"
            onFinish={submitForm}
            validateMessages={validateMessages}
          >
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[{ required: true }]}
            >
              <Input placeholder="Tên sản phẩm" />
            </Form.Item>
            <Form.Item
              name="type"
              label="Loại sản phẩm"
              rules={[{ required: true }]}
            >
              <ListingOptionProductTypes labelInValue />
            </Form.Item>
            <Form.Item
              name="categories"
              label="Nhóm sản phẩm"
              rules={[{ required: true }]}
            >
              <ListingOptionProductCategories mode="multiple" />
            </Form.Item>
            <Divider />
            <div className="flex justify-end">
              <Space>
                <Button
                  type="text"
                  className="text-yellow-500"
                  onClick={onCancel}
                >
                  Cancel
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-24"
                >
                  Finish
                </Button>
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
}
