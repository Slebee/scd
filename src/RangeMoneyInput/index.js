import React, { Component } from "react";
import { Input } from "antd";
import PropTypes from "prop-types";
import { isNaN } from "lodash";
import "./index.less";

export default class RangeMoneyInput extends Component {
  static propTypes = {
    /** 当字段改变事件 */
    onChange: PropTypes.func
  };
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.

    if ("value" in nextProps) {
      return nextProps.value || {};
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      min: value.min || 0,
      max: value.max || 0
    };
  }

  handleNumberChange = field => e => {
    const number = parseInt(e.target.value || 0, 10);
    if (isNaN(number)) {
      return;
    }
    if (!("value" in this.props)) {
      this.setState({ [field]: number });
    }
    this.triggerChange({ [field]: number });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue
      });
    }
  };

  render() {
    const { min, max } = this.state;
    return (
      <span>
        <Input
          className="scd-money-input-min"
          value={min}
          onChange={this.handleNumberChange("min")}
          placeholder="Minimum"
        />
        <Input className="scd-money-input-symbol" placeholder="~" disabled />
        <Input
          className="scd-money-input-max"
          value={max}
          onChange={this.handleNumberChange("max")}
          placeholder="Maximum"
        />
      </span>
    );
  }
}
