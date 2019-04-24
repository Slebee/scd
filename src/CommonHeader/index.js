import React, { Component } from "react";
import { Layout, Menu, Row, Col, Icon, Modal, Avatar, Badge, } from 'antd';
//import router from 'umi/router';
import Cookies from 'js-cookie';
import connect from "../utils/api-connector";
import PropTypes from "prop-types";
import './index.less';

const { Header } = Layout;
const confirm = Modal.confirm;
const SubMenu = Menu.SubMenu;

// 权限菜单编码
const AUTH_MENU = {
  // 我的待办
  'G01585000': {
    icon: 'solution',
    key: 'todo',
    href: '/todo',
    isMap: 'user'
  },
  // 我的公司
  'G01615000': {
    icon: 'home',
    key: 'organization',
    href: '/myCompany',
    isMap: 'user'
  },
  // 文件下载
  'G01684004': {
    icon: 'download',
    key: 'exit',
    isMap: 'user'
  },
  'G01704004': {
    icon: 'download',
    key: 'electronicSignature',
    isMap: 'user'
  }
};


  // 构建权限菜单
const genMenuList = (val) => {
  let menuList = val.reduce((authMenu, item) => {
    for (let key in AUTH_MENU) {
      if (item.code === key) {
        authMenu.push({
          title: item.name,
          icon: AUTH_MENU[key].icon,
          key: AUTH_MENU[key].key,
          href: AUTH_MENU[key].href,
          isMap: AUTH_MENU[key].isMap,
        });
      }
    }
    return authMenu;
  }, []);
  menuList.unshift({
    title:'个人中心',
    icon: 'user',
    key: 'userCenter',
    href: '/userCenter',
    isMap: 'user',
  });
  return menuList;
}


const DEFAULT_MENUAUTHURL ='https://test-gateway.servingcloud.com/api/v1/ucenter/resources/getUserResources',
      DEFAULT_MSGURL ='https://test-gateway.servingcloud.com/api/v1/ucenter/message/getNotReadCount',
      DEFAULT_USERINFOURL ='https://test-gateway.servingcloud.com/api/v1/ucenter/getuser/info';
@connect(({ menuAuthUrl, msgUrl, userInfoUrl, title }) => ({
  // 权限菜单请请求接口
  menuFetch: {
    url: menuAuthUrl || DEFAULT_MENUAUTHURL,
    then: ({ data }) => ({
      value: data
    })
  },
  // 未读消息请求接口
  msgFetch: {
    url: msgUrl || DEFAULT_MSGURL,
    then: ({ data }) => ({
      value: data
    })
  },
  // 用户信息请求接口
  userInfoFetch: {
    url: userInfoUrl || DEFAULT_USERINFOURL,
    then: ({ data }) => ({
      value: data
    })
  },
  // 头部标题
  title
}))
class CommonHeader extends Component {
  static propTypes = {
    // 权限菜单请请求地址
    menuAuthUrl: PropTypes.string,
    // 公告消息请求地址
    msgUrl: PropTypes.string,
    // 用户信息请求地址
    userInfoUrl: PropTypes.string,
    // 导航title
    title: PropTypes.string.isRequired,
    // 退出登录的回调
    onLogout: PropTypes.func,
    // 点击菜单的回调
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onLogout: () => {},
    onClick: () => {}
  };

  state = {
    authMenu: [
      {
        title:'退出',
        icon: 'logout',
        key: 'exit',
        isMap: 'user',
      }
    ]
  }

  // 生成个人中心下拉菜单
 generateMenu = (menuData, isMap, handleClick) => {
    return menuData.reduce((menuList, item) => {
        if (item.isMap === isMap) {
            if ( isMap === 'product') {
                menuList.push(
                    <Menu.Item style={{ textAlign: 'center' }} key={item.key} onClick={handleClick}>
                        <a target="_blank" rel="noopener noreferrer" href={item.href} >{item.title}</a>
                    </Menu.Item>
                )
            } else if ( isMap === 'user') {
                menuList.push(
                    <Menu.Item style={{ marginLeft: '5px' }} key={item.key} onClick={handleClick}>
                        <a target="_blank" rel="noopener noreferrer" href={item.href}>
                            <Icon type={item.icon} style={{ fontSize: '16px' }}/>
                            {item.title}
                        </a>
                    </Menu.Item>
                )
            }
            // else {
            //     menuList.push(
            //         <Menu.Item style={{ textAlign: 'center' }} key={item.key}>
            //            <a rel="noopener noreferrer"  href={item.href} >{item.title}</a>
            //         </Menu.Item>
            //     )
            // }
        }
        return menuList;
    }, [])
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
    if (nextProps.menuFetch.fulfilled) {
      let menu = genMenuList(nextProps.menuFetch.value);
      return {
        authMenu: [...menu, ...prevState.authMenu]
      }
    }
    return null;
  }
  
  render() {
    const {
      msgFetch: { fulfilled: msgFulfilled, value: msgVal},
      userInfoFetch: { fulfilled: userFulfilled, value: userVal },
      title
    } = this.props;

    return (
      <Header style={{ backgroundColor: '#0F83E6', padding: '0 40px' }}>
          <Row type="flex" justify="space-between" style={{ margin: '0 auto', overflow: 'hidden', minWidth: 944 }}>
              <Col>
                <div style={{ fontSize: '18px', color: ' #fff' }}>
                  公司名称：<span>{ title }</span>
                </div>
              </Col>

              <Col span={8}>
                  <Menu
                      mode="horizontal"
                      onClick={this.handleLogout}
                      style={{ width: 'auto', float: 'right', marginRight: '-20px', height: 64, }}
                      className="globalMenuRoot"
                  >
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
                          {this.generateMenu(this.state.authMenu, 'user', this.props.onClick)}
                      </SubMenu>
                  </Menu>
              </Col>
        </Row>
      </Header>
    );
  }
}

export default CommonHeader;
