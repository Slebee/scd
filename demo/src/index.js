import React, { Component } from "react";
import { render } from "react-dom";
import Result from "../../src/Result";

class Demo extends Component {
  render() {
    return (
      <div>
        <Result
          type="error"
          title="提交失败"
          description="请核对并修改以下信息后，再重新提交。"
        />
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
