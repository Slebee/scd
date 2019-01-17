import React from "react";
import SearchSelect from "../SearchSelect";

export default class CompanySearchSelect extends React.Component {
  render() {
    return (
      <SearchSelect
        textFieldName="name"
        valueFieldName="id"
        queryFieldName="companyName"
        notFoundContent="找不到该公司"
        url="/api/v1/ucenter/company/queryLikeName"
        {...this.props}
      />
    );
  }
}
