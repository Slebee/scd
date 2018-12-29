import request from "@sc/request";

// {
//     "companyId": 0,  公司id
//     "fileInfoId": 0, 文件id
//     "moduleCode": "string", 所属模块
//     "productLineId": 0, 所属产品线
//     "userId": 0
//   }
export default function(data) {
  return request("/ms/api/v1/file/getFileDownloadUrl", {
    method: "POST",
    data
  }).then(res => {
    if (res.code === 1) {
      return Promise.resolve(res.data);
    }
    return Promise.reject(res.msg);
  });
}
