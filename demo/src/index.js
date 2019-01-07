import React, { Component } from "react";
import { render } from "react-dom";
import ProductLineSelect from "../../src/ProductLineSelect";
import CitySelect from "../../src/CitySelect";
import ModalWithForm from "../../src/ModalWithForm";
import UploadImageSample from "../../src/UploadImageSample";
import SearchTable from "../../src/SearchTable";

class Demo extends Component {
  render() {
    const columns = [
      {
        title: "产品线",
        dataIndex: "productLineName"
      },
      {
        title: "所属企业",
        dataIndex: "companyName"
      },
      {
        title: "单据类型",
        dataIndex: "receiptTypeName"
      },
      {
        title: "上传文件名称",
        dataIndex: "uploadFileDescription"
      },
      {
        title: "上传文件编码",
        dataIndex: "uploadFileCode"
      }
    ];
    return (
      <div style={{ background: "#ccc" }}>
        <ProductLineSelect style={{ width: 200 }} />
        <CitySelect />
        <ModalWithForm
          type="button"
          modalProps={{ title: "hi" }}
          handleSubmit={(fieldValues, hideModal, toggleModalVisible) => {
            console.log(fieldValues);
            // hideModal();
          }}
          buttonProps={{ type: "primary" }}
          renderModalContent={form => {
            return <div>123</div>;
          }}
        />
        <UploadImageSample />
        <div style={{ width: 700, background: "#fefefe" }}>
          <SearchTable
            rowKey="id"
            url="/ms/api/v1/file-config/queryUploadFileConfigInfo"
            columns={columns}
            // eslint-disable-next-line
            fields={[
              {
                id: "productLineId",
                span: 8,
                type: "ProductLineSelect",
                formItemOptions: {
                  label: "产品线"
                }
              },
              {
                id: "companyId",
                span: 8,
                type: "CompanySearchSelect",
                formItemOptions: {
                  label: "所属企业"
                },
                decoratorOptions: {
                  initialValue: ""
                }
              }
            ]}
          />
        </div>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
