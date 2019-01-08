import React, { Component } from "react";
import { Button, Modal, Spin } from "antd";
import PropTypes from "prop-types";

class ModalWithTrigger extends Component {
  static propTypes = {
    /** Modal的props */
    modalProps: PropTypes.object,
    /** Modal触发器的props */
    buttonProps: PropTypes.object,
    /** 自定义触发器 */
    renderButton: PropTypes.func,
    /** 触发器类型，文本或者按钮 */
    type: PropTypes.string,
    /** 点击确定按钮回调, 参数为切换modal隐藏与否的方法 */
    handleOk: PropTypes.func
  };
  static defaultProps = {
    type: "button",
    handleOk: (toggleVisible, toggleLoading) => {}
  };

  state = {
    modalVisible: false,
    loading: false
  };

  toggleVisible = () => {
    this.setState(({ modalVisible }) => ({
      modalVisible: !modalVisible,
      loading: modalVisible
    }));
  };
  toggleLoading = () => {
    this.setState(({ loading }) => ({
      loading: !loading
    }));
  };
  handleOk = () => {
    const { handleOk } = this.props;
    handleOk && handleOk(this.toggleVisible, this.toggleLoading);
  };

  render() {
    const { modalVisible, loading } = this.state;
    const {
      modalProps,
      buttonProps,
      children,
      type,
      renderButton
    } = this.props;
    let TriggerComponent;

    if (type === "button") {
      TriggerComponent = () => (
        <Button onClick={this.toggleVisible} {...buttonProps} />
      );
    }
    if (type === "text") {
      TriggerComponent = () => (
        <span onClick={this.toggleVisible} {...buttonProps} />
      );
    }
    if (renderButton) {
      TriggerComponent = () => renderButton(this.toggleVisible, buttonProps);
    }
    return (
      <React.Fragment>
        <TriggerComponent />
        <Modal
          title="Modal"
          visible={modalVisible}
          destroyOnClose
          maskClosable={false}
          confirmLoading={loading}
          width={600}
          cancelText="取消"
          okText="确定"
          onOk={this.handleOk}
          onCancel={this.toggleVisible}
          {...modalProps}
        >
          <Spin spinning={loading}>{children}</Spin>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ModalWithTrigger;
