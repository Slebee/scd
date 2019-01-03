import React, { Component } from "react";
import { Upload } from "antd";
import fileToMd5 from "./fileToMd5";
import Base64 from "./Base64";
import axios from "axios";

const uploadProps = {
  action: "/ms/api/v1/file/addNewFile",
  customRequest({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials
  }) {
    let base64Content;
    fileToMd5(file)
      .then(value => {
        base64Content = Base64(value);
        return axios.post(
          action,
          {
            size: file.size,
            digest: base64Content,
            filename: file.name,
            ...data
          },
          {
            withCredentials,
            headers
          }
        );
      })
      .then(({ data: res }) => {
        if (res.code === 1) {
          const { uploadUrl, ossCallback, ossCallbackVar } = res.data;
          return axios.put(uploadUrl, file, {
            headers: {
              // 'Content-Length': file.size,
              "Content-Disposition": `attachment; filename="${encodeURIComponent(
                file.name
              )}"`,
              "Content-MD5": base64Content,
              "x-oss-callback": ossCallback,
              "x-oss-callback-var": ossCallbackVar,
              "content-type": "application/octet-stream"
            },
            onUploadProgress: ({ total, loaded }) => {
              onProgress(
                {
                  percent: parseFloat(
                    Math.round((loaded / total) * 100).toFixed(2)
                  )
                },
                file
              );
            }
          });
        }
        return Promise.reject(res.msg);
      })
      .then(({ data: res }) => {
        if (res.code === 1) {
          onSuccess(
            {
              ...res.data,
              id: res.data.fileId
            },
            file
          );
          return;
        } else {
          return Promise.reject(res.msg);
        }
      })
      .catch(onError);
    return {
      abort() {
        console.log("upload progress is aborted.");
      }
    };
  }
};
export default class CustomUpload extends Component {
  render() {
    const { props } = this;
    return <Upload {...uploadProps} {...props} />;
  }
}
