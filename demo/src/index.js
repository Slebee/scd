import React, { Component } from "react";
import { render } from "react-dom";

import { Button } from "../../src";

class Demo extends Component {
  render() {
    return (
      <div>
        <h1>scd Demo</h1>
        <Button title="123">hey</Button>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
