import React, { Component } from "react";
import { render } from "react-dom";
import Signatures from "../../src/Signatures";
class Demo extends Component {
  render() {
    return (
      <div>
        <Signatures
          markId={
            6048627448872960 // ossKey="ee902942eb594b899a3fec320344446d"
          }
          searchSelectUrl="https://www.easy-mock.com/mock/5c3f0590419c5d0de8845c01/scddemo/ms/api/v1/sc/signatureManagement/seals"
          signUrl="https://www.easy-mock.com/mock/5c3f0590419c5d0de8845c01/scddemo/ms/api/v1/sc/signatureManagement/signByUkey"
          signAgreementUrl="https://www.easy-mock.com/mock/5c3f0590419c5d0de8845c01/scddemo/ms/api/v1/sc/signatureManagement/signAgreement"
          recordList="https://www.easy-mock.com/mock/5c3f0590419c5d0de8845c01/scddemo/ms/api/v1/sc/signatureManagement/record"
        />
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
