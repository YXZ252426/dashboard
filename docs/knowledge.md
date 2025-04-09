### 📦 表单数据处理逻辑说明

该逻辑用于将包含文件和普通字段的表单数据对象 `values` 整理为 `FormData` 对象，便于通过 HTTP 请求进行上传提交。
这里之所以采用FormData而不是json是因为传递了文件
#### ✅ 支持的字段类型：

- **原生 FileList**：例如通过 `<input type="file">` 获取的多文件上传字段
- **UI 上传组件返回的文件数组**：如 Ant Design Upload 组件，文件对象包含 `originFileObj` 字段
- **普通表单字段**：字符串、数字等

#### 🔧 处理流程：

1. 遍历表单对象 `values` 的所有字段
2. 判断每个字段的值类型并分别处理：
   - 如果是 `FileList`，转为数组后将每个文件加入 `FormData`
   - 如果是数组且包含 `originFileObj`，提取出原始 `File` 对象加入 `FormData`
   - 其他类型（如字符串）直接添加到 `FormData`
3. 使用 `formData.forEach` 打印最终生成的字段，便于调试

#### 💡 使用场景：

适用于需要上传图片、文档等文件的表单提交功能，兼容原生 HTML 表单和现代 UI 框架（如 Ant Design）提供的上传组件。