import { Form, Button, Row, Col } from "antd";
import React, { Component } from "react";
import PropTypes from "prop-types";
import generateFields from "../utils/generateFields";
import PageFilter from "./PageFilter";
import TableFilter from "./TableFilter";
import transformFieldValues from "./transformFieldValues";

@Form.create()
class StandardFilter extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    beforeSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    fields: PropTypes.array,
    operationsColSpan: PropTypes.number,
    type: PropTypes.string,
    submitDidMount: PropTypes.bool,
    actions: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  static defaultProps = {
    title: undefined,
    beforeSubmit: values => values,
    onSubmit: () => {},
    fields: [],
    type: "table",
    operationsColSpan: 8,
    submitDidMount: false,
    actions: undefined
  };

  componentDidMount() {
    const { submitDidMount } = this.props;
    if (submitDidMount) this.okHandle();
  }

  resetFields = () => {
    const { form, onSubmit, fields } = this.props;
    form.resetFields();
    onSubmit(transformFieldValues(form.getFieldsValue(), fields));
  };

  okHandle = e => {
    if (e) e.preventDefault();
    const { form, onSubmit, fields, beforeSubmit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      onSubmit(beforeSubmit(transformFieldValues(fieldsValue, fields)));
      // form.resetFields();
    });
  };

  render() {
    const {
      form,
      title,
      fields,
      operationsColSpan,
      type,
      actions
    } = this.props;
    const ComponentWrapper = type === "table" ? TableFilter : PageFilter;
    const advFields = [];
    const defaultFields = fields.filter(item => {
      if (item.adv) advFields.push(item);
      return !item.adv;
    });
    return (
      <ComponentWrapper
        title={title}
        advFields={advFields}
        form={form}
        actions={actions}
        onSubmit={this.okHandle}
        onReset={this.resetFields}
      >
        <Form onSubmit={this.okHandle}>
          <Row gutter={5}>
            {generateFields(form, defaultFields)}
            <Col
              span={operationsColSpan}
              style={{
                textAlign: type === "table" ? "right" : "center",
                marginTop: 3
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 5 }}
                onSubmit={this.okHandle}
              >
                搜索
              </Button>
              <Button onClick={this.resetFields}>重置</Button>
            </Col>
          </Row>
        </Form>
      </ComponentWrapper>
    );
  }
}

export default StandardFilter;
