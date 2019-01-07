# 业务组件库

> 喜盈佳 4.0 公共业务组件库

## demo

[https://gallant-almeida-202c96.netlify.com/](https://gallant-almeida-202c96.netlify.com/)

## 安装使用

> 请先将 npm 源指向公司私有 npm http://verdaccio.servingcloud.com:4873

```shell
$ yarn add scd
```

```javascript
import { UploadImageSample } from 'scd';
...
<UploadImageSample />

```

## TODOS

- [x] ProductLineSelect 产品线下拉选择
- [x] SearchSelect 模糊搜索下拉
- [x] CompanySearchSelect 公司列表模糊查询下拉【基于 SearchSelect 封装数据源】
- [x] CitySelect 省市区选择
- [x] OssUpload OSS 文件上传
- [ ] ModalWithForm 结合 Form 的 Modal，通过向 children 传入 函数的形式构造内部表单内容
- [x] Ellipsis 文本省略号处理【使用 ant pro 的版本】
- [x] Breadcrumbs 面包屑导航
- [x] UploadImageSample 上传图片示例
- [x] AsyncTable 带有远程加载数据能力的 Table 封装

## 开发指南

> 增加组件请增加分支,以组件名命名

开发步骤:

1. clone 项目
2. 从`dev`新建分支
3. 编写代码
4. 向 `dev` 发起 pull request

发布步骤:

1. 修改版本号
2. 将 npm 源指向公司 npm http://verdaccio.servingcloud.com:4873
3. npm publish
