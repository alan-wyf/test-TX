"use client";
import { useEffect } from "react";
import { Col, Form, Input, Row, Radio, DatePicker, InputNumber } from "antd";
import { approvalStatusToChinese } from "../../../../util/util";
import "./Info.css";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
dayjs.locale("zh-cn");

export default function Info(props) {
  const goodsInfo = props.goodsInfo;
  const [infoForm] = Form.useForm();
  const dataForm = props.setDataForm;
  const setData = () => {
    if (dataForm.baseInfoVO !== null) {
      const data = dataForm.baseInfoVO.baseInfoForm;
      data.dateOfDischarge = data.dateOfDischarge
        ? dayjs(data.dateOfDischarge)
        : "";
      infoForm.setFieldsValue(data);
    }
  };
  useEffect(() => {
    setData();
  }, [props.setDataForm]);

  const onValuesChange = () => {
    const from = infoForm.getFieldsValue();
    from["dateOfDischarge"] = dayjs(from["dateOfDischarge"]).format(
      "YYYY-MM-DD"
    );
    props.infoForm(from);
  };
  const checkedForm = () => {
    infoForm
      .validateFields()
      .then(() => {
        props.changeCheck("infoFrom", true);
      })
      .catch(() => {
        props.changeCheck("infoFrom", false);
      });
  };
  useEffect(() => {
    if (props.check) {
      checkedForm();
    }
  }, [props.check]);
  return (
    <Form
      disabled={
        goodsInfo.auditStatus === "1" ||
        goodsInfo.auditStatus === "3" ||
        (goodsInfo.auditStatus === "2" &&
          dataForm.baseInfoVO !== null &&
          dataForm.baseInfoVO.approvalStatus === "approve")
      }
      labelAlign="left"
      layout="vertical"
      form={infoForm}
      name="info"
      onValuesChange={onValuesChange}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name="supervisorNameTwo"
            label="施工总负责人姓名"
            rules={[
              {
                required: true,
                message: "施工总负责人姓名不能为空",
              },
            ]}
          >
            <InputNumber placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="supervisorContactTwo"
            label="施工总负责人联系方式"
            rules={[
              {
                required: true,
                message: "施工总负责人联系方式不能为空",
              },
            ]}
          >
            <InputNumber placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="boothArea"
            label="展位面积"
            rules={[
              {
                required: true,
                message: "展位面积不能为空",
              },
            ]}
          >
            <InputNumber placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="vehicleCount"
            label="展车数量"
            rules={[
              {
                required: true,
                message: "展车数量不能为空",
              },
            ]}
          >
            <InputNumber placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="constructionCertificatesNumber"
            label="施工证数量"
            rules={[
              {
                required: true,
                message: "施工证数量不能为空",
              },
            ]}
          >
            <InputNumber placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="vehicleManagerName"
            label="展车负责人姓名"
            rules={[
              {
                required: true,
                message: "展车负责人姓名不能为空",
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="vehicleManagerContact"
            label="展车负责人联系方式"
            rules={[
              {
                required: true,
                message: "展车负责人联系方式不能为空",
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="constructionCompanyName"
            label="施工单位全称"
            rules={[
              {
                required: true,
                message: "施工单位全称不能为空",
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="constructionChiefEmail"
            label="施工总负责人邮箱"
            rules={[
              {
                required: true,
                message: "施工总负责人邮箱不能为空",
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="constructionChiefIdNumber"
            label="施工总负责人身份证号码"
            rules={[
              {
                required: true,
                message: "施工总负责人身份证号码不能为空",
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="operationManagerName"
            label="运营负责人姓名"
            rules={[
              {
                required: true,
                message: "运营负责人姓名不能为空",
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="operationManagerContact"
            label="运营负责人联系方式"
            rules={[
              {
                required: true,
                message: "运营负责人联系方式不能为空",
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="avManagerName"
            label="AV负责人姓名"
            rules={[
              {
                required: true,
                message: "AV负责人姓名不能为空",
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="avManagerContact"
            label="AV负责人联系方式"
            rules={[
              {
                required: true,
                message: "AV负责人联系方式不能为空",
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="isDoubleLayer"
            label="是否双层结构"
            rules={[
              {
                required: true,
                message: "请选择是否双层结构",
              },
            ]}
          >
            <Radio.Group>
              <Radio value="y">是</Radio>
              <Radio value="n">否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="dateOfDischarge"
            label="预计卸货日期"
            rules={[
              {
                required: true,
                message: "请选择卸货日期",
              },
            ]}
          >
            <DatePicker format={"YYYY-MM-DD"} />
          </Form.Item>
        </Col>
      </Row>
      {dataForm.baseInfoVO !== null && goodsInfo.auditStatus !== "0" ? (
        <Row className="approval-warp">
          <Col span={24}>审核记录</Col>
          <Col span={4}>审核结果</Col>
          <Col span={8}>审核时间</Col>
          <Col span={12}>审核意见</Col>
          <Col span={4}>
            {approvalStatusToChinese(dataForm.baseInfoVO.approvalStatus)}
          </Col>
          <Col span={8}>{dataForm.baseInfoVO.approvalDateTime}</Col>
          <Col span={12}>{dataForm.baseInfoVO.approvalOpinion}</Col>
        </Row>
      ) : null}
    </Form>
  );
}
