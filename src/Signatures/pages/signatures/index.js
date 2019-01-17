import * as React from "react";
import { Card, Button, Modal, message, Input } from "antd";
import AsyncSelect from "../../../AsyncSelect";
import "./signatures.less";
import axios from "axios";
class Contract extends React.Component {
  mouseClientX = 0;

  mouseClientY = 0;

  picWidth = 170;

  picHeight = 170;

  state = {
    strCertID: "",
    imgData: "",
    sealData: [],
    selectSealData: {},
    pageNum: 2,
    signaturesRecord: []
  };

  componentDidMount() {
    const { markId } = this.props;

    window.GetUserList(data => {
      console.log("d.data");
      const strKey = data.retVal.split("&&&")[0].split("||");
      const strCertID = strKey[1];
      this.setState({ strCertID });
      window.ESeaL_GetStampPic(strCertID, d => {
        this.setState({ strCertID, imgData: d.retVal });
      });
    });
    this.delLocalStorage();
    this.getSignaturesRecordList();
  }

  componentWillUnmount() {
    this.delLocalStorage();
    window.document.body.removeEventListener("mousemove", this.sealMouseMove);
  }

  // 清除印章缓存
  delLocalStorage = () => {
    localStorage.removeItem("pageNum");
    localStorage.removeItem("sealLeft");
    localStorage.removeItem("sealTop");
    localStorage.removeItem("sealRight");
    localStorage.removeItem("sealBottom");
  };

  getSealData = data => {
    this.setState({ sealData: data });
    return data;
  };

  changSeal = data => {
    const { sealData } = this.state;
    const selectSealData = sealData.filter(
      item => item.id === data.toString()
    )[0];
    this.setState({ selectSealData });
  };

  getPdfFileAddress = () => {
    const { ossKey } = this.props;
    let url = "/aa.pdf";
    if (ossKey) {
      url = encodeURI(
        `http://signature-service-dev.devops.servingcloud.com/ms/api/v1/sc/signatureManagement/download/${ossKey}`
      );
    }

    return url;
  };

  onSgin = () => {
    const windowAsAny = window;
    const { markId } = this.props;
    const { strCertID, imgData, selectSealData } = this.state;
    const {
      pageNum,
      sealLeft,
      sealTop,
      sealRight,
      sealBottom
    } = windowAsAny.localStorage;

    if (!selectSealData.id) {
      message.warn("请先选择印章");
      return;
    }

    if (!pageNum) {
      message.warn("请先对PDF进行盖章");
      return;
    }

    windowAsAny.GetSignCert(strCertID, data1 => {
      windowAsAny.GetCertBasicinfo(data1.retVal, 2, data2 => {
        this.ukeyID = data2.retVal;
        // 签章证书
        windowAsAny.ESeaL_GetUserCert(strCertID, ret => {
          const certificateInfo = ret.retVal;
          this.inputPassword({
            certificateInfo,
            markId,
            sealId: parseInt(selectSealData.id, 10),
            signatureImg: imgData,
            signatureIndexBottom: parseFloat(sealBottom),
            signatureIndexLeft: parseFloat(sealLeft),
            signatureIndexPageNo: parseFloat(pageNum),
            signatureIndexRight: parseFloat(sealRight),
            signatureIndexTop: parseFloat(sealTop),
            ukeyId: this.ukeyID
          });
        });
      });
    });
  };

  inputPassword = signatureParam => {
    Modal.confirm({
      title: "请输入证书密码",
      content: (
        <Input
          id="contractpwd"
          autoComplete="off"
          type="password"
          placeholder="请输入您的证书密码"
        />
      ),
      okText: "确认签署",
      cancelText: "取消",
      onOk: () => {
        const inptPwd = document.getElementById("contractpwd");
        const pwd = inptPwd.value;
        if (!pwd) {
          message.error("密码不允许为空");
          return true;
        }
        this.fetchPdfUrl(signatureParam, pwd);
        return false;
      }
    });
  };

  sealClick = () => {
    const { imgData } = this.state;
    const sealFaker = window.document.getElementById("sealFaker");
    sealFaker.style.display = "block";
    this.refreshBoundingClientRect();
    window.g_contractIframe.g_seal({
      imgData,
      height: this.picHeight,
      width: this.picWidth,
      leftBoxWidth: this.leftBoxBoundingClientRect.width,
      leftBoxHeight: this.leftBoxBoundingClientRect.height
    });
    window.document.body.addEventListener("mousemove", this.sealMouseMove);
  };

  refreshBoundingClientRect = () => {
    const leftBoxDom = window.document.getElementById("leftBox");
    const signaturesCardDom = window.document.getElementById("signaturesCard");
    this.leftBoxBoundingClientRect = leftBoxDom.getBoundingClientRect();
    this.signaturesCardBoundingClientRect = signaturesCardDom.getBoundingClientRect();
  };

  sealMouseMove = e => {
    const sealFaker = window.document.getElementById("sealFaker");
    this.refreshBoundingClientRect();
    this.mouseClientX = e.clientX;
    this.mouseClientY = e.clientY;
    sealFaker.style.left = `${e.clientX -
      this.signaturesCardBoundingClientRect.left -
      this.picWidth / 2}px`;
    sealFaker.style.top = `${e.clientY -
    this.signaturesCardBoundingClientRect.top - // window.document.documentElement.scrollTop -
      this.picHeight / 2}px`;
    window.top.g_contractIframe.move = (top, left) => {
      this.refreshBoundingClientRect();
      sealFaker.style.left = `${left -
        this.signaturesCardBoundingClientRect.left +
        this.leftBoxBoundingClientRect.left -
        this.picWidth / 2}px`;
      sealFaker.style.top = `${top -
      this.signaturesCardBoundingClientRect.top +
      this.leftBoxBoundingClientRect.top - // window.document.documentElement.scrollTop -
        this.picHeight / 2}px`;
    };
  };

  sealFakerClick = () => {
    window.document.body.removeEventListener("mousemove", this.sealMouseMove);
    const sealFaker = window.document.getElementById("sealFaker");
    this.delLocalStorage();
    sealFaker.style.display = "none";
    window.g_contractIframe.g_removeListener(
      this.mouseClientX -
        this.leftBoxBoundingClientRect.left -
        this.picWidth / 2,
      this.mouseClientY -
        this.leftBoxBoundingClientRect.top -
        this.picHeight / 2
    );
  };

  fetchPdfUrl = (signatureParam, pwd) => {
    let { signUrl } = this.props;

    const parameter = { ...signatureParam };

    if (!signUrl) {
      signUrl = "/ms/api/v1/sc/signatureManagement/signByUkey";
    }

    axios
      .post(signUrl, JSON.stringify(parameter), {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(({ data: res }) => {
        if (res.code === 1) {
          this.contractSign(pwd, res.data);
          return;
        } else {
          return Promise.reject(res.msg);
        }
      })
      .catch(errMsg => {
        message.error(errMsg);
      });
  };

  contractSign = (pwd, digestData) => {
    const windowAsAny = window;
    const { strCertID } = this.state;
    windowAsAny.ESeaL_ClientSignByHash(digestData, strCertID, pwd, ret => {
      this.signPdf(ret.retVal);
    });
  };

  signPdf = data => {
    const { markId, signAgreementUrl } = this.props;
    const { selectSealData } = this.state;
    const parameter = {
      signedInfo: data,
      sealId: parseInt(selectSealData.id, 10),
      markId
    };

    if (!signAgreementUrl) {
      signUrl = "/ms/api/v1/sc/signatureManagement/signAgreement";
    }

    axios
      .post(signAgreementUrl, JSON.stringify(parameter), {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(({ data: res }) => {
        if (res.code === 1) {
          message.success("签署成功");
          return;
        } else {
          return Promise.reject(res.msg);
        }
      })
      .catch(errMsg => {
        message.error(errMsg);
      });
  };

  getSignaturesRecordList = () => {
    let { recordList, markId } = this.props;
    if (!recordList) {
      recordList = "/ms/api/v1/sc/signatureManagement/record";
    }
    axios
      .get(`${recordList}?markId=${markId}`)
      .then(({ data: res }) => {
        if (res.code === 1) {
          const { recodeOnLoadCB } = this.props;
          this.setState({ signaturesRecord: res.data });
          if (recodeOnLoadCB) {
            recodeOnLoadCB(res.data);
          }
          return;
        } else {
          return Promise.reject(res.msg);
        }
      })
      .catch(errMsg => {
        message.error(errMsg);
      });
  };

  render() {
    const { imgData, selectSealData, signaturesRecord, pageNum } = this.state;
    let { searchSelectUrl } = this.props;
    if (!searchSelectUrl) {
      searchSelectUrl = "/ms/api/v1/sc/signatureManagement/seals";
    }
    return (
      <Card className="contractBox" id="signaturesCard">
        <div
          onClick={this.sealFakerClick}
          id="sealFaker"
          className="sealPic"
          style={{
            position: "absolute",
            backgroundImage: `url(data:image/jpg;base64,${imgData})`,
            zIndex: 999,
            display: "none"
          }}
        />
        <div className="leftBox" id="leftBox">
          <div id="pdfIfram">
            <iframe
              title="pdf"
              scrolling="no"
              src={`/web/generic/web/pdf-viewer.html?file=${this.getPdfFileAddress()}&page=${pageNum}`}
              className="contractIframe"
            />
          </div>
        </div>
        <div className="rightBox">
          <Card title="选择签章" className="seal">
            <div style={{ marginBottom: "14px" }}>
              签章：
              <div style={{ display: "inline-block" }}>
                <AsyncSelect
                  textFieldName="name"
                  valueFieldName="id"
                  url={searchSelectUrl}
                  style={{ width: "180px" }}
                  transform={this.getSealData}
                  onChange={this.changSeal}
                />
              </div>
            </div>
            <p>签章类型：{selectSealData.typeFlag}</p>
            <p>签章描述：{selectSealData.typeFlag}</p>
            <div>
              签章样式：
              <div className="sealPicBox">
                <div
                  onClick={this.sealClick}
                  id="seal"
                  className="sealPic"
                  style={{
                    backgroundImage: `url(data:image/jpg;base64,${imgData})`
                  }}
                  onMouseDown={this.movePic}
                />
              </div>
            </div>
          </Card>
          {signaturesRecord.length !== 0 && (
            <div className="recordList">
              {signaturesRecord.map(item => (
                <Card
                  title="签署历史"
                  style={{ marginBottom: "10px" }}
                  key={item.id}
                >
                  <p>{item.signatory}</p>
                  <p>签署人：{item.signer}</p>
                  <p>签署时间：{item.signTime}</p>
                  <p>签章类型：{item.typeFlag}</p>
                </Card>
              ))}
            </div>
          )}
          <div className="operation">
            <a styles={{ float: "left" }}>定位盖章位置</a>
            <Button
              type="primary"
              onClick={this.onSgin}
              style={{ float: "right" }}
            >
              确认签章
            </Button>
          </div>
        </div>
      </Card>
    );
  }
}

export default Contract;
