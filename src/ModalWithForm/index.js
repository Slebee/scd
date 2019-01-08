import React, { Component } from "react";
import { Form, Button, Modal, Spin } from "antd";
import PropTypes from "prop-types";

@Form.create()
class ModalWithForm extends Component {
  static propTypes = {
    /** 点击确定发起form校验，fieldValues是值对象，toggleVisible是切换显示与否状态的方法， toggleLoading是切换加载中与否的方法*/
    handleSubmit: PropTypes.func,
    /** Modal的props */
    modalProps: PropTypes.object,
    /** Modal触发器的props */
    buttonProps: PropTypes.object,
    /** 自定义触发器 */
    renderButton: PropTypes.func,
    /** 触发器类型，文本或者按钮 */
    type: PropTypes.string
  };
  static defaultProps = {
    handleSubmit: (fieldValues, toggleVisible, toggleLoading) => {},
    type: "button"
  };

  state = {
    modalVisible: false,
    loading: false
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, handleSubmit } = this.props;
    form.validateFieldsAndScroll((err, fieldValues) => {
      if (!err) {
        this.toggleLoading();
        handleSubmit &&
          handleSubmit(fieldValues, this.toggleVisible, this.toggleLoading);
      }
    });
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

  render() {
    const { modalVisible, loading } = this.state;
    const {
      form,
      renderModalContent,
      modalProps,
      buttonProps,
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
          title="实名认证"
          visible={modalVisible}
          destroyOnClose
          maskClosable={false}
          confirmLoading={loading}
          width={600}
          cancelText="取消"
          okText="确定"
          onOk={this.handleSubmit}
          onCancel={this.toggleVisible}
          {...modalProps}
        >
          <Spin spinning={loading}>
            <Form onSubmit={this.handleSubmit}>
              {renderModalContent && renderModalContent(form)}
            </Form>
          </Spin>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ModalWithForm;
