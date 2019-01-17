import * as React from "react";
import Signatures from "./pages/signatures";
import { Button, Spin } from "antd";

const baseURL = "";
class Contract extends React.Component {
  state = {
    visble: false,
    loading: true
  };

  scriptFileSrcList = [
    "/scripts/jquery-1.7.2.js",
    "/scripts/jquery.json-2.4.js",
    "/libs/gt.js",
    "/libs/sockjs.min.js",
    "/libs/stomp.min.js",
    "/scripts/ESealForClient.min.js",
    "/scripts/XTXSAB.min.js"
  ];

  setLoading = loading => {
    this.setState({ loading, visble: !loading });
  };

  loadScriptFiles = (index, scriptList) => {
    const contract = window.document.getElementById("contract");
    const scriptDom1 = document.createElement("script");
    scriptDom1.setAttribute("type", "text/javascript");
    scriptDom1.setAttribute("src", baseURL + scriptList[index]);
    contract.appendChild(scriptDom1);
    scriptDom1.onload = () => {
      console.log("onload" + index);
      if (++index < scriptList.length) {
        this.loadScriptFiles(index, scriptList);
      } else {
        setTimeout(() => {
          this.setLoading(false);
        }, 600);
      }
    };
  };
  click = () => {
    this.setState({ visble: true });
  };

  componentDidMount() {
    this.loadScriptFiles(0, this.scriptFileSrcList);
  }

  render() {
    const { visble, loading } = this.state;
    return (
      <div id="contract">
        <Spin spinning={loading}>
          {visble && <Signatures {...this.props} />}
        </Spin>
      </div>
    );
  }
}

export default Contract;
