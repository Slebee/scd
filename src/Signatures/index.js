import * as React from "react";
import Signatures from "./pages/signatures";
import { Button } from "antd";

{
  /* <script src="/scripts/jquery-1.7.2.js" language="javascript"></script>
  <script src="/scripts/jquery.json-2.4.js" language="javascript"></script>
  <script src="/libs/gt.js"></script>
  <script src="/libs/sockjs.min.js"></script>
  <script src="/libs/stomp.min.js"></script> */
}
{
  /* <script src="/scripts/XTXSAB.min.js" language=javascript charset="UTF-8"></script>
  <script src="/scripts/ESealForClient.min.js" language=javascript></script> */
}

class Contract extends React.Component {
  state = {
    visble: false
  };

  componentDidMount() {
    const baseURL = "";
    const contract = window.document.getElementById("contract");
    const scriptDom1 = document.createElement("script");
    scriptDom1.setAttribute("type", "text/javascript");
    scriptDom1.setAttribute("src", baseURL + "/scripts/jquery-1.7.2.js");
    contract.appendChild(scriptDom1);
    scriptDom1.onload = () => {
      const scriptDom7 = document.createElement("script");
      scriptDom7.setAttribute("type", "text/javascript");
      scriptDom7.setAttribute("src", baseURL + "/scripts/jquery.json-2.4.js");
      contract.appendChild(scriptDom7);
      const scriptDom2 = document.createElement("script");
      scriptDom2.setAttribute("type", "text/javascript");
      scriptDom2.setAttribute("src", baseURL + "/libs/gt.js");
      contract.appendChild(scriptDom2);
      const scriptDom3 = document.createElement("script");
      scriptDom3.setAttribute("type", "text/javascript");
      scriptDom3.setAttribute("src", baseURL + "/libs/sockjs.min.js");
      contract.appendChild(scriptDom3);
      const scriptDom4 = document.createElement("script");
      scriptDom4.setAttribute("type", "text/javascript");
      scriptDom4.setAttribute("src", baseURL + "/libs/stomp.min.js");
      contract.appendChild(scriptDom4);
      const scriptDom5 = document.createElement("script");
      scriptDom5.setAttribute("type", "text/javascript");
      scriptDom5.setAttribute("src", baseURL + "/scripts/XTXSAB.min.js");
      contract.appendChild(scriptDom5);
      const scriptDom6 = document.createElement("script");
      scriptDom6.setAttribute("type", "text/javascript");
      scriptDom6.setAttribute(
        "src",
        baseURL + "/scripts/ESealForClient.min.js"
      );
      contract.appendChild(scriptDom6);
    };
  }
  click = () => {
    this.setState({
      visble: true
    });
  };

  render() {
    const { visble } = this.state;
    return (
      <div id="contract">
        <Button onClick={this.click}>打开</Button>
        {visble && <Signatures {...this.props} />}
      </div>
    );
  }
}

export default Contract;
