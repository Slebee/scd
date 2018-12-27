/**
 * Created by liurunbin on 2018/5/18.
 */
import React, { Component } from "react";
import { Select, Spin } from "antd";
import connect from "../utils/api-connector";
import PropTypes from "prop-types";
import Debounce from "lodash-decorators/debounce";
import Bind from "lodash-decorators/bind";
import qs from "qs";

const { Option } = Select;

@connect(({ url, transform }) => ({
  dataFetch: (params = {}) => ({
    data: {
      url: `${url}?${qs.stringify({...params, })}`,
      // method: "POST",
      // body: JSON.stringify(params),
      refreshing: true,
      force: true,
      then: ({ data }) => ({
        value: transform ? transform(data) : data
      })
    }
  })
}))
class SearchSelect extends Component {
  static propTypes = {
    /** 可以对获得的值进行修改 */
    // eslint-disable-next-line
    transform: PropTypes.func,
    /** 选项框值的字段名 */
    valueFieldName: PropTypes.string.isRequired,
    /** 选项框文本的字段名 */
    textFieldName: PropTypes.string.isRequired,

    data: PropTypes.object,
    /** 这个值是用来指定输入值代表的字段名的 */
    queryFieldName: PropTypes.string
  };

  static defaultProps = {
    transform: data => data,
    data: {
      pending: true,
      fulfilled: false,
      value: undefined
    },
    queryFieldName: undefined
  };

  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ("value" in nextProps) {
      if (!nextProps.value) {
        return { value: undefined };
      }
      return { value: nextProps.value } || null;
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || undefined;
    this.state = {
      value
    };
  }

  componentDidMount() {
    const { dataFetch } = this.props;
    dataFetch();
  }

  @Bind()
  @Debounce(300)
  onSearch(value) {
    const { dataFetch, queryFieldName } = this.props;
    dataFetch(
      queryFieldName
        ? {
            [queryFieldName]: value
          }
        : null
    );
  }

  handleSelectChange = value => {
    if (!("value" in this.props)) {
      this.setState({ value });
    }
    this.triggerChange(value);
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  };

  render() {
    const {
      data: { pending, fulfilled, value },
      valueFieldName,
      textFieldName,
      style
    } = this.props;
    const { value: stateValue } = this.state;
    return (
      <Spin spinning={pending} style={{ width: style ? style.width : "auto" }}>
        <Select
          showSearch
          placeholder="请输入关键字"
          optionFilterProp="children"
          value={stateValue}
          style={style}
          onSearch={this.onSearch}
          onSelect={this.handleSelectChange}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
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
export default SearchSelect;
