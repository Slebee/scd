import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Form } from "antd";
import generateFields from "../utils/generateFields";
class StandardForm extends Component {
  static propTypes = {
    fields: PropTypes.array
  };
  static defaultProps = {
    fields: []
  };
  render() {
    const { form, fields } = this.props;
    return <Fragment>{generateFields(form, fields)}</Fragment>;
  }
}

export const utils = { generateFields };
export default StandardForm;
