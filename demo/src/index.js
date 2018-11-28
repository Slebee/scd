import React, { Component } from "react";
import { render } from "react-dom";

import { Button, AsyncSelect } from "../../src";

class Demo extends Component {
  render() {
    return (
      <div>
        <h1>scd Demo</h1>
        <Button title="123">hey</Button>
        <AsyncSelect
          textFieldName="orgName"
          valueFieldName="orgId"
          url="https://www.easy-mock.com/mock/5bca15263eea383b1c901d99/factoring/company/queryByName/a"
          style={{ width: "200px" }}
        />
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
