import React, { Component, createRef } from "react";
import { message } from "antd";
import StandardTable from "../StandardTable";
import PropTypes from "prop-types";
import qs from "qs";
import { isEqual } from "lodash";
import connect from "../utils/api-connector";

@connect(({ url, params, pagination }) => ({
  refreshData: (pageParams) => ({
    dataFetch: {
      url: `${url}?${qs.stringify({
          ...pagination,
        //   pageSize: pagination.pageSize,
        //   current: pagination.current,
        //   pageSizeOptions: pagination.pageSizeOptions,
          ...pageParams,
          ...params
        })}`,
      method: "GET",
      // body: JSON.stringify({ ...pageParams, ...params }),
      force: true,
      then: ({ data: { list, pageNum, total, pageSize, order, asc } }) => ({
        value: {
          list,
          pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            current: pageNum,
            // sorter: {
            //   order: asc ? `${asc}end` : ``,
            //   field: order
            // },
            total,
            pageSize,
            showTotal: counts => `总共 ${counts} 条`,
            pageSizeOptions: [
              "5",
              "10",
              "20",
              "30",
              "40",
              "50",
              "60",
              "70",
              "80",
              "90",
              "100"
            ],
            ...pagination
          },
        }
      }),
      catch: (res =>{
        message.error(res.message)
      }),
    }
  })
}))
class StandardAsyncTable extends Component {
  static propTypes = {
    /** 列表项配置 */
    columns: PropTypes.array,

    /** 列表项唯一key */
    rowKey: PropTypes.string,

    /** promiseState */
    dataFetch: PropTypes.object,
    /** 组件加载完毕是否要获取数据 */
    fetchOnDidMount: PropTypes.bool,

    /** 滚动条 */
    scroll: PropTypes.object,

    /** 选择功能配置 */
    rowSelection: PropTypes.object,

    /** url */
    url: PropTypes.string.isRequired,
    /** table 的 props*/
    tableOptiProps: PropTypes.object,

    /** pagination 的 props*/
    pagination: PropTypes.object,
  };

  static defaultProps = {
    columns: [],
    // selectedRows: [],
    rowKey: "key",
    // selectRowAble: false,
    dataFetch: {
      pending: false,
      fulfilled: false,
      value: {
        list: [],
        pagination: undefined
      }
    },
    fetchOnDidMount: true,
    scroll: undefined,
    rowSelection: undefined
  };

  constructor(props) {
    super(props);
    this.tableRef = createRef();
    const { getInstance } = props;
    if (typeof getInstance === "function") {
      getInstance(this); // 在这里把this暴露给`parentComponent`
    }
  }

  componentDidMount() {
    const { refreshData, fetchOnDidMount } = this.props;
    if (fetchOnDidMount) refreshData({});
  }

  componentWillReceiveProps(nextProps) {
    const { params } = this.props;
    if (!isEqual(nextProps.params, params)) {
      nextProps.refreshData(nextProps.params);
    }
  }

  onChange = (pagination, filters, sorter) => {
    const { refreshData, handleTableChange } = this.props;
    const { field, order } = sorter;
    refreshData({
      asc: order ? order.replace("end", "") === "asc" : undefined,
      order: field || undefined,
      page: pagination.current,
      pageSize: pagination.pageSize
    });
    handleTableChange && handleTableChange()
  };

  cleanSelectedKeys = () => {
    this.tableRef.cleanSelectedKeys();
  };

  render() {
    const { rowKey, columns, dataFetch, scroll, rowSelection, tableOptiProps, pagination } = this.props;

    const defaultData = {
        list: [],
        pagination,
      };
    return (
      <StandardTable
        tableOptiProps={tableOptiProps}
        rowSelection={rowSelection}
        rowKey={rowKey}
        // eslint-disable-next-line
        ref={ref => (this.tableRef = ref)}
        loading={dataFetch.pending}
        columns={columns}
        data={dataFetch.fulfilled ? dataFetch.value : defaultData}
        onChange={this.onChange}
        scroll={scroll}
      />
    );
  }
}

export default StandardAsyncTable;
