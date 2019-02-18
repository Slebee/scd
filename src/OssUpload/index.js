import React, { Component, Fragment } from "react";
import { Upload, Modal } from "antd";
import PropTypes from "prop-types";
import fileToMd5 from "./fileToMd5";
import Base64 from "./Base64";
import axios from "axios";
import Cookies from "js-cookie";

const CONTENT_TYPES = {
  picture: "image/png",
  other: "application/octet-stream"
};
const CONTENT_DISPOSITION = {
  picture: "inline",
  other: "attachment"
};

export default class CustomUpload extends Component {
  static propTypes = {
    /** 请传http请求中的 content-type */
    contentType: PropTypes.string,
    /** Content-Disposition,不需要filename */
    contentDisposition: PropTypes.string,
    /** Modal的props */
    modalProps: PropTypes.object
  };
  static defaultProps = {
    contentType: CONTENT_TYPES.picture,
    contentDisposition: CONTENT_DISPOSITION.picture,
    modalProps: {}
  };

  state = {
    previewVisible: false,
    previewImage: '',
  };

  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  render() {
    const { props } = this;
    const uploadProps = {
      action: "/api/v1/ucenter/addNewFile",
      customRequest({
        action,
        data,
        file,
        // filename,
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
                digestMethod: 1,
                filename: file.name,
                ...data
              },
              {
                withCredentials,
                headers:{
                    'token': Cookies.get('token')
                }
              }
            );
          })
          .then(({ data: res }) => {
            if (res.code === 1) {
              const { uploadUrl, ossCallback, ossCallbackVar } = res.data;
              return axios.put(uploadUrl, file, {
                headers: {
                  // 'Content-Length': file.size,
                  "Content-Disposition": `${
                    props.contentDisposition
                  }; filename="${encodeURIComponent(file.name)}"`,
                  "Content-MD5": base64Content,
                  "x-oss-callback": ossCallback,
                  "x-oss-callback-var": ossCallbackVar,
                  "content-type": props.contentType,
                  'token': Cookies.get('token')
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
      },
      onPreview:(file)=>{
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
      }
    };
    const { previewVisible, previewImage } = this.state;
    return (
      <Fragment>
        <Upload {...uploadProps} {...props} />
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
          {...props.modalProps}
        >
          <img
            alt="example"
            style={{ width: "100%" }}
            src={previewImage}
          />
        </Modal>
      </Fragment>
    )
  }
}
