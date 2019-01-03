import React, { Component } from "react";
import { render } from "react-dom";
import ProductLineSelect from "../../src/ProductLineSelect";
import CitySelect from "../../src/CitySelect";
import ModalWithForm from "../../src/ModalWithForm";
import UploadImageSample from "../../src/UploadImageSample";

class Demo extends Component {
  render() {
    return (
      <div>
        <ProductLineSelect style={{ width: 200 }} />
        <CitySelect />
        <ModalWithForm
          type="text"
          modalProps={{ title: "hi" }}
          handleSubmit={(fieldValues, hideModal, toggleModalVisible) => {
            console.log(fieldValues);
            // hideModal();
          }}
          renderModalContent={form => {
            return <div>123</div>;
          }}
        />
        <UploadImageSample />
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
