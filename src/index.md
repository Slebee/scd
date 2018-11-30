---
name: 喜盈佳4.0前端说明
route: /
---

## 前端项目

- 公共服务平台
- 运营平台

### 公共服务平台

公共服务平台使用 `umi` 创建页面

```shell
$ mkdir project && cd project
$ yarn create umi
```

使用空格键分别选择 `antd`、`dva`、`hard source`、`dll`

在 `yarn` 安装即可

### 运营平台

> 基于 antd pro 开发，开发方式请直接参考 [antd pro](https://pro.ant.design/)

## 私有 npm

目前使用 Verdaccio, 地址为 http://verdaccio.servingcloud.com:4873

请按以下步骤操作

全局安装 npm 源切换工具

```shell
$npm install -g nrm
```

查看当前使用源

```shell
$nrm ls
* npm -----  https://registry.npmjs.org/
  cnpm ----  http://r.cnpmjs.org/
  taobao --  https://registry.npm.taobao.org/
  nj ------  https://registry.nodejitsu.com/
  rednpm -- http://registry.mirror.cqupt.edu.cn
  skimdb -- https://skimdb.npmjs.com/registry
```

添加公司 npm 地址

```shell
$nrm add sc http://verdaccio.servingcloud.com:4873/
```

将源切换至公司 npm

```shell
$nrm use sc
```

正常使用 npm 即可，nrm 切换对 yarn 同样生效，使用 npm 安装包的时候会优先从私有 npm 上下载，如果没有将会从 npm 官方下载

## 业务组件库 - scd

> 业务组件库基于 antd 组件封装，对一些常见组件如 异步获取数据的下拉框、异步获取数据的表格等等

使用方式，将 npm 源切换至公司后

```shell
$yarn add scd
```
