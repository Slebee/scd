import React from "react";
import { Link } from 'react-router-dom'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { Breadcrumb } from 'antd';
import PropTypes from 'prop-types'

const data = [
  '/myCompany/', //公司列表
  '/messages/', //消息
  '/home/', //首页
  '/organization/', //组织
  '/user-center/', //登录
  '/help/', //帮助中心
  '/todo/', //待办
];

function composeMenus(list) {
  const arr = [];
  list.forEach((item) => {
      if(item && (!item.path ||item.path ==='/')) return
      if (item.children) {
          arr.push( item,  ...composeMenus(item.children) );
      }else{
          arr.push(item);
      }
  });
  return arr;
}

const Breadcrumbs = ({ route }) => {
  const routes = composeMenus(route.routes)
  const name = window.location.pathname;
  if (routes && Array.isArray(routes)) {
    const AntdBreadcrumb = withBreadcrumbs(routes)(({ breadcrumbs }) => {
      return (
        <Breadcrumb classNames="spread">
          {
            data.indexOf(name) > -1 && (
              <Breadcrumb.Item key={name}><a href="/home/#/dashboard">工作台</a></Breadcrumb.Item>
            )
          }
          {breadcrumbs.map((breadcrumb, index) => {
            if(breadcrumb && breadcrumb.key==='/') return
            return (
                <Breadcrumb.Item key={breadcrumb.key}>
                  {breadcrumbs.length - 1 === index ? (
                    breadcrumb.props.title
                  ) : (
                    <Link
                      to={{
                        pathname: breadcrumb.props.match.url,
                        state: breadcrumb.props.match.params ? breadcrumb.props.match.params : {},
                        query: breadcrumb.props.location.query ? breadcrumb.props.location.query : {},
                      }}
                    >
                      {breadcrumb.props.title}
                    </Link>
                  )}
                </Breadcrumb.Item>
            )
          })}
        </Breadcrumb>
      );
    });
    return <AntdBreadcrumb />;
  }
};
Breadcrumbs.propTypes = {
    /** 路由 基于umi创建出来都是 route：{} 所以直接接收对象*/
  route: PropTypes.object.isRequired,
}
export default Breadcrumbs;