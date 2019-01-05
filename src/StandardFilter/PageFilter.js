import React, { Component } from "react";
import { Row, Col, Icon, Button } from "antd";
import generateFields from "../utils/generateFields";
import styles from "./PageFilter.less";

class PageFilter extends Component {
  constructor(props) {
    super(props);
    // Create a div that we'll render the modal into. Because each
    // Modal component has its own element, we can render multiple
    // modal components into the modal container.
    this.state = {
      // hack
      // eslint-disable-next-line
      visible: false
    };
  }

  toggleVisible = e => {
    e.preventDefault();
    this.setState(({ visible }) => ({
      visible: !visible,
      advHeight: !visible ? this.advRef.current.scrollHeight : 0
    }));
  };

  goBack = e => {
    e.preventDefault();
    const { history } = this.props;
    // TODO: 后退的逻辑需要确定一下
    history.push("/Home");
    // history.goBack();
  };

  render() {
    const {
      children,
      form,
      advFields,
      onSubmit,
      onReset,
      actions
    } = this.props;
    const { advHeight } = this.state;
    const hasFields = advFields.length !== 0;
    return (
      <Row className={styles.wrapper}>
        <Row className={styles.content}>
          <Col span={21}>{children}</Col>
          {hasFields && (
            <Col span={3} className={styles.moreButton}>
              <a onClick={this.toggleVisible}>
                <Icon type="menu-fold" theme="outlined" />
                <span className={styles.moreButtonText}>高级查询</span>
              </a>
            </Col>
          )}
        </Row>
        {hasFields && (
          <div
            className={styles.advancedQueryWrap}
            ref={this.advRef}
            style={{ height: advHeight }}
          >
            <Row className={styles.advancedQueryFieldsWrap}>
              {generateFields(form, advFields)}
            </Row>
            <div className={styles.advancedQueryButtonWrap}>
              <div className={styles.advancedQueryButtonContent}>
                <Button
                  type="primary"
                  onClick={onSubmit}
                  style={{ marginRight: 10 }}
                >
                  搜索
                </Button>
                <Button onClick={onReset}>重置</Button>
              </div>
            </div>
            {actions && <Row>{actions}</Row>}
          </div>
        )}
      </Row>
    );
    // return filter;
  }
}

export default PageFilter;
