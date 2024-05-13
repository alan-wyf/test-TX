"use client";
import { useState, useEffect } from "react";
import "./detail.css";
import { Breadcrumb, Tabs, Row, Col, Button, Space, message, Spin } from "antd";
import {
  getProjectDetail,
  getProjectData,
  postSave,
  postSubmit,
  getMaterialList,
  getVehiclesList,
} from "../../api/api";
import {
  checkedInfoForm,
  checkedProveForm,
  checkedCostForm,
  checkedCarForm,
  getUrlState,
} from "../../util/util";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./detail.css";
import Header from "../components/header/Header";
import Info from "./components/info/Info";
import Prove from "./components/prove/Prove";
import Cost from "./components/cost/Cost";
import Car from "./components/car/Car";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
dayjs.locale("zh-cn");

export default function Detail() {
  const navigate = useNavigate();
  let state = getUrlState();
  const id = "id" in state ? state.id : "nodata";
  const [dataForm, setDataForm] = useState({
    baseInfoVO: null,
    relevantQualificationsVO: null,
    collectFeeVO: null,
    vehicleAccessVO: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [infoForm, setInfoFrom] = useState(null);
  const [proveForm, setProveForm] = useState(null);
  const [costForm, setCostForm] = useState(null);
  const [carForm, setCarForm] = useState(null);
  const [materialList, setMaterialList] = useState([]);
  const [vehiclesList, setVehiclesList] = useState([]);
  const [goodsInfo, setGoodsInfo] = useState({
    projectName: "",
    brandName: "",
    projectNumber: "",
    auditStatus: "",
    startDate: "",
    endDate: "",
    boothNumber: "",
    boothSize: "",
    chargePersonName: "",
    chargePersonPhone: "",
    orderNumber: "",
    isInputVehicle: "",
    investmentExhibitionDetailNumber: "",
  });
  const [checkedFrom, setCheckedFrom] = useState(false);
  const [currIndex, setCurrIndex] = useState("1");
  const [formStatus, setFormStatus] = useState({
    infoForm: false,
    proveForm: false,
    costForm: false,
    carForm: false,
  });
  const getDetail = async () => {
    if (id === "nodata") navigate("/index", { replace: true });
    const res = await getProjectDetail(id);
    if (res && res.code === 200) {
      setGoodsInfo(res.data);
      if (res.data.projectNumber) handleMaterialList(res.data.projectNumber);
      if (res.data.orderNumber) {
        getData(res.data.orderNumber);
        handleVehiclesList();
      } else {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    getDetail();
  }, []);
  const getData = async (data) => {
    const res = await getProjectData(data);
    if (res && res.code === 200) {
      const dataForm = res.data;
      setDataForm(dataForm);
      if (dataForm.baseInfoVO !== null) {
        const data = dataForm.baseInfoVO.baseInfoForm;
        setInfoFrom(data);
      }
      if (dataForm.relevantQualificationsVO !== null) {
        setProveForm(dataForm.relevantQualificationsVO);
      }
      if (
        dataForm.collectFeeVO !== null &&
        dataForm.collectFeeVO.collectFeeForm !== null
      ) {
        const dataSubmitSource =
          dataForm.collectFeeVO.collectFeeForm.collectFeeListVO;
        setCostForm({
          collectFeeDTOList: dataSubmitSource,
          attachment: dataForm.collectFeeVO.collectFeeForm.attachment,
          totalDepositAmount: dataForm.collectFeeVO.collectFeeForm.dueDeposit,
          totalCost: dataForm.collectFeeVO.collectFeeForm.dueFee,
        });
      }
      if (
        dataForm.vehicleAccessVO !== null &&
        dataForm.vehicleAccessVO.vehicleAccessForm !== null
      ) {
        const vehicleAccessListVO =
          dataForm.vehicleAccessVO.vehicleAccessForm.vehicleAccessListVO;
        setCarForm([...vehicleAccessListVO]);
      }
    }
    setIsLoading(false);
  };
  const handleMaterialList = async (data) => {
    const res = await getMaterialList(data);
    if (res && res.code === 200) {
      setMaterialList(res.data);
    }
  };
  const handleVehiclesList = async () => {
    const res = await getVehiclesList();
    if (res && res.code === 200) {
      setVehiclesList(res.data);
    }
  };
  const onTabChange = (key) => {
    setCurrIndex(key);
  };
  const getInfoForm = (e) => {
    setInfoFrom(e);
  };
  const getProveForm = (e) => {
    setProveForm(e);
  };
  const getCostForm = (e) => {
    setCostForm(e);
  };
  const getCarForm = (e) => {
    setCarForm(e);
  };
  const onSave = async () => {
    // console.log("infoForm", infoForm);
    // console.log("proveForm", proveForm);
    // console.log("costForm", costForm);
    // console.log("carForm", carForm);
    if (costForm !== null) {
      const collectFeeDTOList = JSON.parse(
        JSON.stringify(costForm.collectFeeDTOList)
      );
      for (const item in costForm.collectFeeDTOList) {
        if (typeof costForm.collectFeeDTOList[item].startTime === "object") {
          costForm.collectFeeDTOList[item].startTime = dayjs(
            costForm.collectFeeDTOList[item].startTime
          ).format("YYYY-MM-DD hh:mm");
        }
        if (typeof costForm.collectFeeDTOList[item].endTime === "object") {
          costForm.collectFeeDTOList[item].endTime = dayjs(
            costForm.collectFeeDTOList[item].endTime
          ).format("YYYY-MM-DD hh:mm");
        }
        if (typeof costForm.collectFeeDTOList[item].materialName === "object")
          continue;
        const materialName = {
          id: collectFeeDTOList[item].materialName,
        };
        costForm.collectFeeDTOList[item].materialName = materialName;
      }
    }
    if (infoForm !== null) {
      if (typeof infoForm.dateOfDischarge === "object") {
        infoForm.dateOfDischarge = dayjs(infoForm.dateOfDischarge).format(
          "YYYY-MM-DD"
        );
      }
    }
    const data = {
      baseInfoDTO: {
        investmentExhibitionDetailNumber:
          goodsInfo.investmentExhibitionDetailNumber,
        projectCode: goodsInfo.projectNumber,
        orderNumber: goodsInfo.orderNumber,
        id: dataForm.baseInfoVO === null ? "" : dataForm.baseInfoVO.id,
        ...infoForm,
      },
      relevantQualificationsDTO: {
        id:
          dataForm.relevantQualificationsVO === null
            ? ""
            : dataForm.relevantQualificationsVO.id,
        ...proveForm,
      },
      totalDetails: {
        id: dataForm.collectFeeVO === null ? "" : dataForm.collectFeeVO.id,
        ...costForm,
      },
      vehicleAccessDTOList: carForm,
    };
    const res = await postSave(data);
    if (res && res.code === 200) {
      message.success("保存成功");
    }
  };
  const onSubmit = async () => {
    // console.log("infoForm", infoForm);
    // console.log("proveForm", proveForm);
    // console.log("costForm", costForm);
    // console.log("carForm", carForm);
    setCheckedFrom(true);

    if (!checkedInfoForm(infoForm)) {
      message.error("当前表单有信息缺失，请检查");
      setCurrIndex("1");
      return;
    }
    if (!checkedProveForm(proveForm)) {
      message.error("当前表单有信息缺失，请检查");
      setCurrIndex("2");
      return;
    }
    if (!checkedCostForm(costForm)) {
      message.error("当前表单有信息缺失，请检查");
      setCurrIndex("3");
      return;
    }
    if (!checkedCarForm(carForm, goodsInfo)) {
      message.error("当前表单有信息缺失，请检查");
      setCurrIndex("4");
      return;
    }

    if (costForm !== null) {
      const collectFeeDTOList = JSON.parse(
        JSON.stringify(costForm.collectFeeDTOList)
      );
      for (const item in costForm.collectFeeDTOList) {
        if (typeof costForm.collectFeeDTOList[item].startTime === "object") {
          costForm.collectFeeDTOList[item].startTime = dayjs(
            costForm.collectFeeDTOList[item].startTime
          ).format("YYYY-MM-DD hh:mm");
        }
        if (typeof costForm.collectFeeDTOList[item].endTime === "object") {
          costForm.collectFeeDTOList[item].endTime = dayjs(
            costForm.collectFeeDTOList[item].endTime
          ).format("YYYY-MM-DD hh:mm");
        }
        if (typeof costForm.collectFeeDTOList[item].materialName === "object")
          continue;
        const materialName = {
          id: collectFeeDTOList[item].materialName,
        };
        costForm.collectFeeDTOList[item].materialName = materialName;
      }
    }
    if (infoForm !== null) {
      if (typeof infoForm.dateOfDischarge === "object") {
        infoForm.dateOfDischarge = dayjs(infoForm.dateOfDischarge).format(
          "YYYY-MM-DD"
        );
      }
    }
    const data = {
      baseInfoDTO: {
        investmentExhibitionDetailNumber:
          goodsInfo.investmentExhibitionDetailNumber,
        projectCode: goodsInfo.projectNumber,
        orderNumber: goodsInfo.orderNumber,
        id: dataForm.baseInfoVO === null ? "" : dataForm.baseInfoVO.id,
        ...infoForm,
      },
      relevantQualificationsDTO: {
        id:
          dataForm.relevantQualificationsVO === null
            ? ""
            : dataForm.relevantQualificationsVO.id,
        ...proveForm,
      },
      totalDetails: {
        id: dataForm.collectFeeVO === null ? "" : dataForm.collectFeeVO.id,
        ...costForm,
      },
      vehicleAccessDTOList: carForm,
    };
    const res = await postSubmit(data);
    if (res && res.code === 200) {
      message.success("提交成功");
      getDetail();
    }
  };
  const changFromChecked = (from, status) => {
    switch (from) {
      case "infoFrom":
        formStatus.infoForm = status;
        break;
      case "proveForm":
        formStatus.proveForm = status;
        break;
      case "costForm":
        formStatus.costForm = status;
        break;
      case "carForm":
        formStatus.carForm = status;
        break;
      default:
        break;
    }
    setFormStatus({ ...formStatus });
  };
  const items = [
    {
      key: "1",
      label: "基本信息",
      children: (
        <Info
          goodsInfo={goodsInfo}
          infoForm={getInfoForm}
          setDataForm={dataForm}
          check={checkedFrom}
          changeCheck={changFromChecked}
        />
      ),
    },
    {
      key: "2",
      label: "相关资质",
      children: (
        <Prove
          goodsInfo={goodsInfo}
          proveForm={getProveForm}
          setDataForm={dataForm}
          check={checkedFrom}
          changeCheck={changFromChecked}
        />
      ),
    },
    {
      key: "3",
      label: "现场收费",
      children: (
        <Cost
          goodsInfo={goodsInfo}
          costForm={getCostForm}
          setDataForm={dataForm}
          check={checkedFrom}
          changeCheck={changFromChecked}
          getMaterialList={materialList}
        />
      ),
    },
    {
      key: "4",
      label: "车辆出入",
      children: (
        <Car
          goodsInfo={goodsInfo}
          carForm={getCarForm}
          setDataForm={dataForm}
          check={checkedFrom}
          changeCheck={changFromChecked}
          getVehiclesList={vehiclesList}
        />
      ),
    },
  ];
  return (
    <div className="detail-warp">
      <div className="detail-warp-header">
        <Header />
      </div>
      <Spin
        style={{ maxHeight: "800px" }}
        spinning={isLoading}
        tip="数据加载中..."
        size="large"
      >
        <div className="detail-warp-body">
          <div className="body-breadcrumb">
            <Breadcrumb
              items={[
                {
                  title: <Link to={"/index"}>项目管理</Link>,
                },
                {
                  title: "审核资料",
                },
              ]}
            />
          </div>
          <div className="body-top">
            <div className="body-top-title">{goodsInfo.projectName}</div>
            <Row className="body-top-txt" gutter={24}>
              <Col span={6}>项目编码：{goodsInfo.projectNumber}</Col>
              <Col span={6}>品牌：{goodsInfo.brandName}</Col>
              <Col span={6}>展位号：{goodsInfo.boothNumber}</Col>
              <Col span={6}>背景*纵深：{goodsInfo.boothSize}</Col>
              <Col span={6}>施工总负责人姓名：{goodsInfo.chargePersonName}</Col>
              <Col span={6}>
                施工总负责人联系方式：{goodsInfo.chargePersonPhone}
              </Col>
              <Col span={6}>开始日期：{goodsInfo.startDate}</Col>
              <Col span={6}>结束日期：{goodsInfo.endDate}</Col>
            </Row>
          </div>
          <div className="body-content">
            <Tabs activeKey={currIndex} items={items} onChange={onTabChange} />
          </div>
          <div className="body-bottom">
            <Space size="small">
              <Button
                disabled={
                  goodsInfo.auditStatus !== "0" && goodsInfo.auditStatus !== "2"
                }
                onClick={onSave}
              >
                保存
              </Button>
              <Button
                disabled={
                  goodsInfo.auditStatus !== "0" && goodsInfo.auditStatus !== "2"
                }
                onClick={onSubmit}
                type="primary"
              >
                提交
              </Button>
            </Space>
          </div>
        </div>
      </Spin>
    </div>
  );
}
