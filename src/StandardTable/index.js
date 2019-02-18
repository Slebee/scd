import React, { PureComponent } from "react";
import { Table, Alert } from "antd";
import PropTypes from "prop-types";
import styles from "./index.less";

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  static propTypes = {
    columns: PropTypes.array,
    data: PropTypes.shape({
      list: PropTypes.array,
      pagination: PropTypes.object
    }),
    selectedRows: PropTypes.array,
    rowKey: PropTypes.string,
    onChange: PropTypes.func,
    scroll: PropTypes.object
  };

  static defaultProps = {
    columns: [],
    data: {
      list: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: total => `总共 ${total} 条`,
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
        ]
      }
    },
    selectedRows: [],
    rowKey: "key",
    onChange: () => {},
    scroll: undefined
  };

  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList
    };
  }

  // static getDerivedStateFromProps(nextProps) {
  //   // clean state
  //   if (nextProps.selectedRows.length === 0) {
  //     const needTotalList = initTotalList(nextProps.columns);
  //     return {
  //       selectedRowKeys: [],
  //       needTotalList,
  //     };
  //   }
  //   return null;
  // }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce(
        (sum, val) => sum + parseFloat(val[item.dataIndex], 10),
        0
      )
    }));
    const { onSelectRow, rowSelection } = this.props;
    if (onSelectRow) onSelectRow(selectedRows);
    if (rowSelection && rowSelection.onChange)
      rowSelection.onChange(selectedRowKeys, selectedRows);

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    onChange(pagination, filters, sorter);
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const {
      data: { list, pagination },
      loading,
      columns,
      rowKey,
      rowSelection,
      scroll,
      tableOptiProps,
    } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination
    };

    const nextRowSelection = rowSelection
      ? {
          ...rowSelection,
          selectedRowKeys,
          onChange: this.handleRowSelectChange,
          getCheckboxProps: record => ({
            disabled: record.disabled
          })
        }
      : undefined;

    return (
      <div className={styles.standardTable}>
        {nextRowSelection && (
          <div className={styles.tableAlert}>
            <Alert
              message={
                <React.Fragment>
                  已选择{" "}
                  <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>{" "}
                  项&nbsp;&nbsp;
                  {needTotalList.map(item => (
                    <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                      {item.title}
                      总计&nbsp;
                      <span style={{ fontWeight: 600 }}>
                        {item.render ? item.render(item.total) : item.total}
                      </span>
                    </span>
                  ))}
                  {selectedRowKeys.length !== 0 && (
                    <a
                      onClick={this.cleanSelectedKeys}
                      style={{ marginLeft: 24 }}
                    >
                      清空
                    </a>
                  )}
                </React.Fragment>
              }
              type="info"
              showIcon
            />
          </div>
        )}
        <Table
            {...tableOptiProps}
            loading={loading}
            rowKey={rowKey}
            rowSelection={nextRowSelection}
            dataSource={list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            scroll={scroll}
        />
      </div>
    );
  }
}

export default StandardTable;
