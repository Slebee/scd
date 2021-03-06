import React from "react";
import { Link } from 'react-router-dom'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { Breadcrumb } from 'antd';
import PropTypes from 'prop-types'

const list = [
    '/login',
    '/login/',
    '/register',
    '/register/Agreement',
    '/register/agreement',
    '/resetPassword',
    '/resetPassword/result',
  ]

  function composeMenus(list, data) {
    const arr = [];
    list.forEach((item) => {
        if(item && ( !item.path || !item.title || item.path ==='/' || data.indexOf(item.path) > -1 )) return
        if (item.children) {
            arr.push( item,  ...composeMenus(item.children) );
        }else{
            arr.push(item);
        }
    });
    return arr;
  }
  
  const Breadcrumbs = ({ route, location, removeList=[], breadcrumbOptions }) => {
  
    const array = list.concat(removeList),
          routes = composeMenus(route.routes, array),
          name = window.location.pathname.toLowerCase(), //str = name.replace(/\//g,'');
          oPath = location.pathname.toLowerCase();
          //console.log(routes, oPath)
    if (routes && Array.isArray(routes) && (name === oPath)) {
      const AntdBreadcrumb = withBreadcrumbs(routes)(({ breadcrumbs }) => {
        // const data = breadcrumbs.filter(item =>item.props.location.pathname.toLowerCase() === oPath.toLowerCase()).length < 1
        // if (data) return null
        return (
          <Breadcrumb classNames="spread" {...breadcrumbOptions} style={{
            height: '40px', lineHeight:'40px', padding: '0px 40px', background:'#fcfcfc'
          }}>
            {
              name !== '/dashboard' && (
                <Breadcrumb.Item key={name}><a href="/dashboard">工作台</a></Breadcrumb.Item>
              )
            }
            {breadcrumbs.map((breadcrumb, index) => {
              if(breadcrumb && (breadcrumb.key==='/'|| breadcrumb.key==='/dashboard') ) return null
              return (
                  <Breadcrumb.Item key={breadcrumb.key}>
                    {breadcrumbs.length - 1 === index ? (
                      breadcrumb.props.title
                    ) : (
                      <Link
                        to={{
                          pathname: breadcrumb.props.match.url,
                          //state: breadcrumb.props.match.params ? breadcrumb.props.match.params : {},
                          //query: breadcrumb.props.location.query ? breadcrumb.props.location.query : {},
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
    return null
  };
  
  Breadcrumbs.propTypes = {
    /** 路由 基于umi创建出来都是 route：{} 所以直接接收对象*/
    route: PropTypes.object.isRequired,
    /** 当前页面的路由*/
    location:PropTypes.object.isRequired,
    /** 需要删除的路由,默认值['/login','/register','/register/Agreement',] */
    removeList:PropTypes.array,
    /** 接收所有 antd Breadcrumb 的 props*/
    breadcrumbOptions: PropTypes.object
  }
  export default Breadcrumbs;
  