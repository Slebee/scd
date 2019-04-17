import React, { Component } from "react";
import { render } from "react-dom";
import ProductLineSelect from "../../src/ProductLineSelect";
import CitySelect from "../../src/CitySelect";
import ModalWithForm from "../../src/ModalWithForm";
import UploadImageSample from "../../src/UploadImageSample";
import SearchTable from "../../src/SearchTable";
import StandardAsyncTable from "../../src/StandardAsyncTable";
import StandardForm from "../../src/StandardForm";
import OssUpload from "../../src/OssUpload";
import { Form, Button } from "antd";

@Form.create()
class Demo extends Component {
  renderButton = toggleVisible => (
    <Button onClick={toggleVisible}>aaasssss</Button>
  );
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

    const standardAsyncTable_Columns = [
        { title: "名称", dataIndex: "name" },
        {
          title: "状态",
          dataIndex: "state",
          sorter: true
        }
      ];
    const { form } = this.props;
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
          renderButton={toggleVisible => (
            <Button onClick={toggleVisible}>aaasssss</Button>
          )}
          buttonProps={{ type: "primary", children: "hei" }}
          renderModalContent={form => {
            return <div>123</div>;
          }}
        />
        <UploadImageSample />
        <OssUpload
          data={{
            businessId: 0,
            businessType: "string",
            companyId: 0,
            digestMethod: 1,
            ext: "",
            moduleCode: "company",
            productLineId: 0
          }}
        >
          上传
        </OssUpload>
        <div>
          <StandardForm
            onSubmit={values => {
              console.log(values);
            }}
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
          >
            <Button type="primary" htmlType="submit">
              发送
            </Button>
          </StandardForm>
        </div>
        <div style={{ background: "#fefefe", marginTop: 100 }}>
            <h1>StandardAsyncTable</h1>
          <StandardAsyncTable
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
            pagination={{ pageSize: 5 }}
          />
        </div>

        <div style={{ background: "#fefefe", marginTop: 100 }}>
            <h1>SearchTable</h1>
            <SearchTable
                url="https://test-gateway.servingcloud.com/api/v1/ucenter/message/getMessageList"
                rowKey="id"
                title="页面列表页"
                fields={[
                    {
                      id: "billCode",
                      span: 10,
                      formItemOptions: {
                        label: "付款单号"
                      }
                    }
                  ]}
                columns={[
                    { title: "名称", dataIndex: "subject" },
                    {
                      title: "状态",
                      dataIndex: "id",
                      sorter: true
                    }
                  ]}
                pagination={{ pageSize: 5 }}
            />
        </div>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
