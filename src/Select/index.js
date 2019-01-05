import React, { Component } from 'react';
import { Select } from 'antd';

const Options = Select.Option;

// disable because Form need class
// eslint-disable-next-line
export default class SelectWithOptions extends Component {
  render() {
    const { options } = this.props;
    return (
      <Select {...this.props}>
        {options.map(({ text, value }) => (
          <Options key={value} value={value}>
            {text}
          </Options>
        ))}
      </Select>
    );
  }
}
