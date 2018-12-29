import React from "react";
import { Select } from "antd";
import productLine from "../localData/productLine.json";

const { Option } = Select;

export default class ProductLineSelect extends Component {
  render() {
    return (
      <Select {...this.props}>
        {productLine.data.map((val, index) => (
          <Option key={index} value={`${index}`}>
            {val}
          </Option>
        ))}
      </Select>
    );
  }
}
