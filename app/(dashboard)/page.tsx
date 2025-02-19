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
import { Form, Input, Select, Button, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ProbabilityChart } from "@/components/ui/chart";

// 文件上传处理
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function DiagnosisPage() {
  // 用于存放从后端返回的概率结果
  const [probabilities, setProbabilities] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // 提交表单
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      // 设置返回的概率数据，进入图表展示模式
      setProbabilities(data.probabilities);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 重置状态，返回表单界面重新提交
  const handleReset = () => {
    setProbabilities([]);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">疾病诊断</h1>

        {/* 如果成功返回结果，则只展示图表，同时提供返回按钮 */}
        {probabilities.length > 0 ? (
          <div className="flex flex-col items-center">
            <ProbabilityChart probabilities={probabilities} />
            <Button type="primary" onClick={handleReset} className="mt-4">
              返回表单重新提交
            </Button>
          </div>
        ) : (
          <Form
            layout="vertical"
            onSubmitCapture={handleSubmit}
            className="w-full"
          >
            {/* 年龄 */}
            <Form.Item label="年龄" name="Patient-Age">
              <Input type="number" />
            </Form.Item>

            {/* 性别 */}
            <Form.Item label="性别" name="Patient-Sex">
              <Select>
                <Select.Option value="true">男</Select.Option>
                <Select.Option value="false">女</Select.Option>
              </Select>
            </Form.Item>

            {/* 左眼眼底图 */}
            <Form.Item
              label="左眼眼底图"
              name="Left-Fundus"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload action="/upload.do" listType="picture-card">
                <Button icon={<PlusOutlined />}>上传</Button>
              </Upload>
            </Form.Item>

            {/* 右眼眼底图 */}
            <Form.Item
              label="右眼眼底图"
              name="Right-Fundus"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload action="/upload.do" listType="picture-card">
                <Button icon={<PlusOutlined />}>上传</Button>
              </Upload>
            </Form.Item>

            {/* 左眼诊断关键词 */}
            <Form.Item label="左眼诊断关键词" name="Left-Diagnostic-Keywords">
              <Input />
            </Form.Item>

            {/* 右眼诊断关键词 */}
            <Form.Item label="右眼诊断关键词" name="Right-Diagnostic-Keywords">
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
        )}
      </div>
    </div>
  );
}
