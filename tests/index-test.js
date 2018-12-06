import expect from "expect";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

const Component = () => "Welcome to React components";

describe("Component", () => {
  let node;

  beforeEach(() => {
    node = document.createElement("div");
  });

  afterEach(() => {
    unmountComponentAtNode(node);
  });

  it("displays a welcome message", () => {
    render(<Component />, node, () => {
      expect(node.innerHTML).toContain("Welcome to React components");
    });
  });
});
