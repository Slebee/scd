import React, { Component } from "react";
import { Layout, Menu, Row, Col, Icon, Modal, Avatar, Badge, Button } from 'antd';
//import router from 'umi/router';
import Cookies from 'js-cookie';
import connect from "../utils/api-connector";
import PropTypes from "prop-types";
import './index.less';

const { Header } = Layout;
const confirm = Modal.confirm;
const SubMenu = Menu.SubMenu;

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1157489_hdovywho2do.js',
});

@connect(({ baseURL = 'https://test-gateway.servingcloud.com' }) => ({
  // 权限菜单请请求接口
  userResourcesFetch: {
    url: `${baseURL}/api/v1/ucenter/resources/header/UserResources`,
    then: ({ data }) => ({
      value: data
    })
  },
  // 未读消息请求接口
  msgFetch: {
    url: `${baseURL}/api/v1/ucenter/message/getNotReadCount`,
    then: ({ data }) => ({
      value: data
    })
  },
  // 用户信息请求接口
  userInfoFetch: {
    url: `${baseURL}/api/v1/ucenter/getuser/info`,
    then: ({ data }) => ({
      value: data
    })
  },
  // 公司资源请求接口
  compResourcesFetch: {
    url: `${baseURL}/api/v1/ucenter/index/comp-resources`,
    then: ({ data }) => ({
      value: data
    })
  }
}))
class CommonHeader extends Component {
  static propTypes = {
    // 请求url前缀
    baseURL: PropTypes.string,
    // 退出登录的回调
    onLogout: PropTypes.func,
    // 点击菜单的回调
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onLogout: () => {},
    onClick: () => {}
  };

  // 获取首页url
  static getHomeLink(companyType) {
    if (companyType === 'admin') {
      return `/dashboard`;
      //公司身份 purchaser=核心企业 project=项目公司 都同时跳转到 purchaser 核心企业
    }else if (companyType === 'purchaser' || companyType === 'project') {
     return `/purchaser`;
    } else {
      return `/${companyType}`;
    }
  }

  state = {
    authMenu: [ 
      {
        ico: 'logout',
        id: 'exit',
        name: "退出"
      }
    ],
    isInit: false,
    homeLink: '',
    title: ''
  }

  // 生成个人中心下拉菜单
  generateMenu = (menuList, handleClick) => {
    return menuList.reduce((menu, item) => {            
      menu.push(
        <Menu.Item style={{ marginLeft: '5px' }} key={item.id} onClick={handleClick}>
          <a target="_blank" rel="noopener noreferrer" href={item.uri}>
            {
              /^icon/.test(item.ico) ? <IconFont type={item.ico} style={{ fontSize: '16px' }}/> 
              : <Icon type={item.ico} style={{ fontSize: '16px' }} />
            }
            {item.name}
          </a>
        </Menu.Item>
      );
      return menu;
    }, []);
  }

  // 退出
  handleLogout = ({ key }) => {
    if (key === 'exit') {
      confirm({
        okText: '确定',
        cancelText: '取 消',
        title: '系统提示',
        content: '确定要退出吗',
        onOk: () => {
          Cookies.remove('token')
          window.location.href='/login'
          this.props.onLogout();
        },
      });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.userResourcesFetch.fulfilled && !prevState.isInit){
      if (nextProps.userResourcesFetch.value && nextProps.userResourcesFetch.value.length) {
        let authMenu = [...nextProps.userResourcesFetch.value, ...prevState.authMenu];
        return {
          authMenu,
          isInit: true
        }
      } else {
        return null;
      } 
    }

    if (nextProps.compResourcesFetch.fulfilled) {
        if(nextProps.compResourcesFetch && nextProps.compResourcesFetch.value){
            let { companyName, companyType } = nextProps.compResourcesFetch && nextProps.compResourcesFetch.value;
            return {
            title: companyName && companyName ? companyName : '',
            homeLink: CommonHeader.getHomeLink(companyType)
            }
        }
        return null;
    }
  }

  render() {
    const {
      msgFetch: { fulfilled: msgFulfilled, value: msgVal},
      userInfoFetch: { fulfilled: userFulfilled, value: userVal }
    } = this.props;

    return (
      <Header style={{ backgroundColor: '#0F83E6', padding: '0 40px' }}>
          <Row type="flex" justify="space-between" style={{ margin: '0 auto', overflow: 'hidden', minWidth: 944 }}>
              <Col>
                <div style={{ fontSize: '18px', color: ' #fff' }}>
                  公司名称：<span>{ this.state.title }</span>
                </div>
              </Col>

              <Col span={8}>
                  <Menu
                    mode="horizontal"
                    onClick={this.handleLogout}
                    style={{ width: 'auto', float: 'right', marginRight: '-20px', height: 64, }}
                    className="globalMenuRoot"
                  >
                    <Menu.Item key="home">
                      <a rel="noopener noreferrer" style={{ color: '#fff' }} href={ this.state.homeLink }>
                        首页
                      </a>
                    </Menu.Item>

                    <Menu.Item key="messages" className="globalMenu">
                      <Badge count={(msgFulfilled && msgVal &&  parseInt(msgVal, 0)) || 0}>
                          <a rel="noopener noreferrer" style={{ color: '#fff' }} href={'/messages'}>
                              <Icon type="bell" />
                          </a>
                      </Badge>
                    </Menu.Item>

                    {/** 个人中心下拉菜单 **/}
                    <SubMenu
                      key="user"
                      style={{ marginTop: '5px' }}
                      title={
                        <a style={{ color: '#fff', display: 'inline-block', textDecoration: 'none' }} to='/dashboard'>
                            <Avatar style={{ backgroundColor: '#ccc', marginRight: 5 }} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            {userFulfilled && userVal && userVal.name}
                        </a>
                      }
                    >
                      {this.generateMenu(this.state.authMenu, this.props.onClick)}
                    </SubMenu>
                  </Menu>
              </Col>
        </Row>
      </Header>
    );
  }
}

export default CommonHeader;
