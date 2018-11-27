import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import "./Button.less";

export default class NButton extends Component {
  static propTypes = {
    /** 可以对获得的值进行修改 */
    title: PropTypes.string.isRequired
  };

  render() {
    const { props } = this;
    return (
      <div className="wrap">
        <Button {...props} />
      </div>
    );
  }
}
