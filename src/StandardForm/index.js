import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form } from "antd";
import generateFields from "../utils/generateFields";
import defaultFormatter from "./formatFieldValues";

@Form.create()
class StandardForm extends Component {
  static propTypes = {
    /** 字段配置数组 */
    fields: PropTypes.array,
    /** 值集合的格式化方法 */
    formatter: PropTypes.func,
    /** Submit */
    onSubmit: PropTypes.func
  };
  static defaultProps = {
    fields: [],
    formatter: (values, fields) => values,
    onSubmit: values => {}
  };
  handleSubmit = e => {
    e && e.preventDefault && e.preventDefault();
    const {
      form: { validateFields },
      onSubmit,
      fields,
      formatter
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onSubmit(formatter(values, fields));
      }
    });
  };
  render() {
    const { form, fields, children } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        {generateFields(form, fields)}
        {children}
      </Form>
    );
  }
}

StandardForm.prototype.generateFields = generateFields;
StandardForm.prototype.defaultFormatter = defaultFormatter;

export default StandardForm;
