import React, { Component } from "react";
import StandardFilter from "../StandardFilter";
import StandardAsyncTable from "../StandardAsyncTable";
import PropTypes from "prop-types";
import { Card } from "antd";

const TextItem = ({ children, color, fontSize }) => (
  <div style={{ color, fontSize }}>{children}</div>
);
TextItem.defaultProps = {
  color: "#333",
  fontSize: 14
};

export default class SearchTable extends Component {
  static propTypes = {
    /** 展示形式分为table的形态与页面形态 */
    type: PropTypes.oneOf(["table", "page"]),
    /** 操作列占据的col数 */
    operationsColSpan: PropTypes.number,
    /** 行数据唯一key */
    rowKey: PropTypes.string,
    /** 列表请求地址 */
    url: PropTypes.string.isRequired,
    /** 请求的额外参数 */
    params: PropTypes.object,
    /** 表格列配置 */
    columns: PropTypes.array.isRequired,
    /** 标题 */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /** table标题 */
    tableTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /** extra */
    extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /** 字段配置 */
    fields: PropTypes.array.isRequired,
    /** 滚动条 */
    scroll: PropTypes.object,
    /** 选择功能配置 */
    rowSelection: PropTypes.object,
    /** 发起请求前回调，可以对fields进行手动修改 */
    beforeSubmit: PropTypes.func,
    /** 介于搜索栏与表格栏中间的节点 */
    actions: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  static defaultProps = {
    type: "table",
    operationsColSpan: 8,
    params: null,
    rowKey: "key",
    title: undefined,
    extra: undefined,
    tableTitle: undefined,
    scroll: undefined,
    rowSelection: undefined,
    beforeSubmit: values => values,
    actions: undefined
  };

  static TableTextItem = TextItem;

  state = {
    ownParams: {}
  };

  asyncTable = null;

  setParams = ownParams => {
    this.setState({
      ownParams
    });
  };

  refresh = () => {
    const { ownParams } = this.state;
    this.setParams({
      ...ownParams,
      //_t: Date.now()
    });
    return this;
  };

  cleanSelectedKeys = () => {
    this.asyncTable.cleanSelectedKeys();
    return this;
  };

  render() {
    const {
      rowKey,
      columns,
      title,
      params,
      url,
      type,
      operationsColSpan,
      fields,
      scroll,
      tableTitle,
      rowSelection,
      beforeSubmit,
      extra,
      actions
    } = this.props;
    const { ownParams } = this.state;
    const nextPrams = {
      ...ownParams,
      ...params
    };
    return (
      <React.Fragment>
        <StandardFilter
          title={title}
          submitDidMount
          beforeSubmit={beforeSubmit}
          onSubmit={this.setParams}
          type={type}
          actions={actions}
          fields={fields}
          operationsColSpan={operationsColSpan}
        />
        <Card title={tableTitle} bordered={false} extra={extra}>
          <StandardAsyncTable
            url={url}
            fetchOnDidMount={false}
            params={nextPrams}
            // eslint-disable-next-line
            getInstance={asyncTable => (this.asyncTable = asyncTable)}
            rowSelection={rowSelection}
            scroll={scroll}
            rowKey={rowKey}
            columns={columns}
          />
        </Card>
      </React.Fragment>
    );
  }
}
