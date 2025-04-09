// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card';

// export default function CustomersPage() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Customers</CardTitle>
//         <CardDescription>View all customers and their orders.</CardDescription>
//       </CardHeader>
//       <CardContent></CardContent>
//     </Card>
//   );
// }
"use client";

import React, { useState, FormEvent } from "react";
import { Form, Input, Select, Button, Upload, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ProbabilityChart } from "@/components/ui/chart";
import { API_ROUTES } from "@/lib/api";

// 文件上传处理
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function DiagnosisPage() {
  const [form] = Form.useForm();
  const [results, setResults] = useState<number[][]>([]); // 改为存储多个结果数组
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const formData = new FormData();

    // 遍历表单数据，将其填充到 FormData
    Object.keys(values).forEach((key) => {
      const value = values[key];
    
      if (value instanceof FileList) {
        Array.from(value).forEach((file) => {
          formData.append(key, file);
        });
      } else if (Array.isArray(value)) {
        value.forEach((file) => {
          if (file.originFileObj instanceof File) {
            formData.append(key, file.originFileObj);
          }
        });
      } else {
        formData.append(key, value);
      }
    });

    try {
      const res = await fetch(API_ROUTES.DIAGNOSIS, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        // 处理返回的多个结果
        const allResults = data.map(item => item.result || []);
        setResults(allResults);
      } else {
        console.error("返回数据格式不正确:", data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults([]);
    form.resetFields();
  };

  if (results.length > 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl text-center">
          <h1 className="text-2xl font-bold mb-4">疾病诊断结果</h1>
          <Row gutter={[16, 16]} justify="center">
            {results.map((probabilities, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={results.length > 1 ? 6 : 12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">
                    {results.length > 1 ? `诊断结果 ${index + 1}` : "诊断结果"}
                  </h2>
                  <ProbabilityChart probabilities={probabilities} />
                </div>
              </Col>
            ))}
          </Row>
          <Button type="primary" onClick={handleReset} className="mt-6">
            返回表单重新提交
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">疾病诊断</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="w-full"
        >
          {/* 年龄 */}
          <Form.Item
            label="年龄"
            name="Patient-Age"
            rules={[{ required: true, message: "请输入年龄!" }]}
          >
            <Input type="number" />
          </Form.Item>

          {/* 性别 */}
          <Form.Item
            label="性别"
            name="Patient-Sex"
            rules={[{ required: true, message: "请输入性别!" }]}
          >
            <Select>
              <Select.Option value="male">男</Select.Option>
              <Select.Option value="female">女</Select.Option>
            </Select>
          </Form.Item>

          {/* 左眼眼底图 */}
          <Form.Item
            label="左眼眼底图"
            name="Left-Fundus"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "请上传图片!" }]}
          >
            <Upload multiple listType="picture-card" beforeUpload={() => false}>
              <Button icon={<PlusOutlined />}>上传</Button>
            </Upload>
          </Form.Item>

          {/* 右眼眼底图 */}
          <Form.Item
            label="右眼眼底图"
            name="Right-Fundus"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "请上传图片!" }]}
          >
            <Upload multiple listType="picture-card" beforeUpload={() => false}>
              <Button icon={<PlusOutlined />}>上传</Button>
            </Upload>
          </Form.Item>

          {/* 左眼诊断关键词 */}
          <Form.Item
            label="左眼诊断关键词"
            name="Left-Diagnostic-Keywords"
            rules={[{ required: true, message: "请输入关键词!" }]}
          >
            <Input />
          </Form.Item>

          {/* 右眼诊断关键词 */}
          <Form.Item
            label="右眼诊断关键词"
            name="Right-Diagnostic-Keywords"
            rules={[{ required: true, message: "请输入关键词!" }]}
          >
            <Input />
          </Form.Item>

          {/* 提交按钮 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              {loading ? "提交中..." : "提交"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}