/**
 * Created by liuliyuan on 2019/4/25.
 */
import React, { Component } from "react";
import { Select, Spin } from "antd";
import connect from "../utils/api-connector";
import PropTypes from "prop-types";
import Debounce from "lodash-decorators/debounce";
import Bind from "lodash-decorators/bind";
import qs from "qs";

const { Option } = Select;
let current = 1;
@connect(({ url, transform }) => ({
  dataFetch: (params = {}, list=[]) => ({
    data: {
      url: `${url}?${qs.stringify({ ...params })}`,
      // method: "POST",
      // body: JSON.stringify(params),
      refreshing: true,
      force: true,
      then: ({ data }) => {
        return ({
          value: transform ? transform( { ...data, list: list.concat(data.list)} ) : { ...data, list: list.concat(data.list)}
        })
      }
    }
  })
}))
class ScrollSearchSelect extends Component {
  static propTypes = {
    /** 可以对获得的值进行修改 */
    // eslint-disable-next-line
    transform: PropTypes.func,
    /** 选项框值的字段名 */
    valueFieldName: PropTypes.string.isRequired,
    /** 选项框文本的字段名 */
    textFieldName: PropTypes.string.isRequired,

    /** 这个不需要理会 */
    data: PropTypes.object,
    /** 这个值是用来指定输入值代表的字段名的 */
    queryFieldName: PropTypes.string,

    /** 找不到对应记录时显示的文字信息 */
    notFoundContent: PropTypes.string
  };

  static defaultProps = {
    transform: data => data,
    data: {
      pending: true,
      fulfilled: false,
      value: undefined
    },
    queryFieldName: undefined,
    notFoundContent: "暂无记录"
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
    current=1;
    const { dataFetch, queryFieldName, data, } = this.props;
    this.setState({
      [queryFieldName]: value
    },()=>{
      dataFetch(
        queryFieldName
          ? {
              [queryFieldName]: value
            }
          : null
      );
    });
  }

  handleSelectChange = value => {
    current=1;
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

  @Bind()
  @Debounce(500)
  onPopupScroll = e => {
    e.persist();
    let target = e.target;
    const { dataFetch, queryFieldName, data: { value } } = this.props;
    const currentCount = value.list.length;
    const totalCount = value.total;
    // 如果滚动到底且列表已加载数据小于所有数据长度时，发送请求获取下一页数据
    // if (target.scrollHeight - target.scrollTop - target.offsetHeight < 1 ) {
    if (target.scrollTop + target.offsetHeight === target.scrollHeight && currentCount < totalCount) {
      // scrollToEnd, do something!!!
      current++;
      dataFetch({ [queryFieldName]: this.state[queryFieldName], 'page': current }, value.list);
    }
  }

  render() {
    const {
      data: { pending, fulfilled, value },
      valueFieldName,
      textFieldName,
      notFoundContent,
      style,
    } = this.props;
    const iumProps = {
        ...this.props
    };
    const { value: stateValue } = this.state;
    return (
      <Spin spinning={pending} style={{ width: style ? style.width : "auto" }}>
        <Select
          showSearch
          placeholder="请输入关键字"
          optionFilterProp="children"
          notFoundContent={notFoundContent}
          value={stateValue}
          style={style}
          onSearch={this.onSearch}
          onSelect={this.handleSelectChange}
          onPopupScroll={this.onPopupScroll}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          {...iumProps}
        >
          {fulfilled &&
            value && value.list &&
            value.list.map(val => (
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
export default ScrollSearchSelect;
