import React, { Component } from "react";
import { Select, Spin } from "antd";
import connect from "../utils/api-connector";
import PropTypes from "prop-types";

const { Option } = Select;

@connect(({ url, transform }) => ({
  dataFetch: {
    url: `${url}`,
    then: ({ data }) => ({
      value: transform ? transform(data) : data
    })
  }
}))
class AsyncSelect extends Component {
  static propTypes = {
    /** 请求地址 */
    url: PropTypes.string.isRequired,
    /** 取值的字段名 */
    valueFieldName: PropTypes.string.isRequired,
    /** label */
    textFieldName: PropTypes.string.isRequired,
    /** 转换方法，在获取异步数据后可以自行转换 */
    transform: PropTypes.func
  };

  static defaultProps = {
    transform: data => data
  };

  render() {
    const {
      dataFetch: { pending, fulfilled, value },
      valueFieldName,
      textFieldName
    } = this.props;
    const iumProps = {
      ...this.props
    };
    return (
      <Spin
        spinning={pending}
        style={{ width: iumProps.style.width || "auto" }}
      >
        <Select {...iumProps}>
          {fulfilled &&
            value &&
            value.map(val => (
              <Option
                key={`${val[valueFieldName]}`}
                value={val[valueFieldName]}
              >
                {val[textFieldName]}
              </Option>
            ))}
        </Select>
      </Spin>
    );
  }
}
export default AsyncSelect;
