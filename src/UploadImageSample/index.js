import React, { Component } from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";

export default class UploadImageSample extends Component {
  static propTypes = {
    /** 预览图片的url地址 */
    previewImage: PropTypes.string
  };
  static defaultProps = {
    previewImage:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
  };
  state = {
    previewVisible: false
  };
  handleCancel = () => {
    console.log(1);
    this.setState({ previewVisible: false });
  };

  handlePreview = () => {
    this.setState({
      previewVisible: true
    });
  };
  render() {
    const { previewVisible } = this.state;
    const { previewImage } = this.props;
    return (
      <React.Fragment>
        <div
          className="ant-upload-list ant-upload-list-picture-card"
          onClick={this.handlePreview}
          style={{ cursor: "pointer" }}
        >
          <div
            className="ant-upload-list-item ant-upload-list-item-done"
            style={{ backgroundColor: "#fff" }}
          >
            <div className="ant-upload-list-item-info">
              <span>
                <img
                  className="ant-upload-list-item-thumbnail"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  alt="xxx.png"
                  style={{ height: 55 }}
                />
                <p style={{ textAlign: "center", marginTop: 5 }}>示例图</p>
              </span>
            </div>
          </div>
        </div>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </React.Fragment>
    );
  }
}
