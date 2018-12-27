/* eslint-disable consistent-return */
// api-connector.js
import { connect } from "react-refetch";
import { getToken } from "./index";
import { processBuildUrlDomain } from ".";
// import request from './request';
connect.options({ withRef: true });
function parse(cause) {
  const { error, message } = cause;

  if (error) {
    return error;
  }
  if (message) {
    return message;
  }
  return "";
}
function newError(cause) {
  const e = new Error(parse(cause));
  e.cause = cause;
  return e;
}
const checkIsInPageByPath = str => {
  const reg = new RegExp(str);
  return reg.test(window.location.pathname.toLowerCase());
};
const csvConnector = connect.defaults({
  buildRequest(mapping) {
    const options = {
      ...mapping,
      headers: {
        ...mapping.headers,
        // Authorization: getToken()
        token: "014f6dce6387406084609daa852de257"
      }
    };

    return new Request(processBuildUrlDomain(mapping.url), options);
  },
  handleResponse(response) {
    if (response.status === 401) {
      // @HACK
      /* eslint-disable no-underscore-dangle */
      if (!checkIsInPageByPath("/user/login"))
        window.g_app._store.dispatch({
          type: "login/logout"
        });
      return Promise.reject();
    }
    if (
      response.headers.get("content-length") === "0" ||
      response.status === 204
    ) {
      return;
    }

    const json = response.json(); // TODO: support other response types

    if (response.status >= 200 && response.status < 300) {
      // TODO: support custom acceptable statuses

      return json.then(data => {
        if (data.code === 200) {
          return Promise.resolve({
            data: data.data,
            msg: data.msg
          });
        }
        return Promise.reject(newError({ error: data.msg }));
      });
    }

    return json.then(cause => Promise.reject(newError(cause)));
  }
});
export default csvConnector;
