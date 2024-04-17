"use client";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Upload, message } from "antd";
import { getBaseUrl } from "../../../../config";
import { approvalStatusToChinese } from "../../../../util/util";
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  let list = [];
  for (const item of e?.fileList) {
    if (item.status === "done") {
      if ("response" in item) {
        if (item.response.code !== 200) {
          item.status = "error";
          message.error(item.response.msg);
          continue;
        }
        const uploadData = item.response.data;
        uploadData.uid = uploadData.id;
        list.push(uploadData);
      } else {
        list.push(item);
      }
    }
    if ("id" in item) {
      list.push(item);
    }
  }
  return list;
};

export default function Prove(props) {
  const goodsInfo = props.goodsInfo;
  const [proveForm] = Form.useForm();
  const dataForm = props.setDataForm;
  const [isShow, setIsShow] = useState(false);
  const setData = () => {
    if (dataForm.relevantQualificationsVO !== null) {
      for (const i in dataForm.relevantQualificationsVO) {
        if (
          dataForm.relevantQualificationsVO[i] !== null &&
          typeof dataForm.relevantQualificationsVO[i] === "object"
        ) {
          for (const item of dataForm.relevantQualificationsVO[i]) {
            item.uid = item.id;
            item.status = "done";
          }
        }
      }
      proveForm.setFieldsValue(dataForm.relevantQualificationsVO);
    }
    setIsShow(true);
  };
  useEffect(() => {
    setData();
  }, [props.setDataForm]);
  const onValuesChange = () => {
    props.proveForm(proveForm.getFieldsValue());
    props.changeCheck(false);
  };
  const checkedForm = () => {
    proveForm
      .validateFields()
      .then(() => {
        props.changeCheck("proveForm", true);
      })
      .catch(() => {
        props.changeCheck("proveForm", false);
      });
  };
  useEffect(() => {
    if (props.check) {
      checkedForm();
    }
  }, [props.check]);

  const handleChange = (info, name) => {
    if (info.file.status === "done") {
      let list = [];
      for (const item of info.fileList) {
        if (item.status === "done") {
          if ("response" in item) {
            if (item.response.code !== 200) {
              item.status = "error";
              message.error(item.response.msg);
              continue;
            }
            const uploadData = item.response.data;
            uploadData.uid = uploadData.id;
            list.push(uploadData);
          } else {
            list.push(item);
          }
          proveForm.setFieldValue(name, proveForm.getFieldValue(name));
          onValuesChange();
        }
      }
    }
  };
  if (!isShow) return;
  return (
    <Form
      disabled={
        goodsInfo.auditStatus === "1" ||
        goodsInfo.auditStatus === "3" ||
        (goodsInfo.auditStatus === "2" &&
          dataForm.baseInfoVO !== null &&
          dataForm.baseInfoVO.approvalStatus === "approve")
      }
      layout="vertical"
      labelAlign="left"
      form={proveForm}
      name="prove"
      onValuesChange={onValuesChange}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name="constructionUnit"
            label="施工单位营业执照副本"
            rules={[
              {
                required: true,
                message: "施工单位营业执照副本不能为空",
              },
            ]}
            valuePropName="constructionUnit"
            getValueFromEvent={(e) =>
              normFile(e, proveForm.getFieldValue("constructionUnit"))
            }
          >
            <Upload
              name="file"
              action={`${getBaseUrl().baseURL}file/upload`}
              headers={{
                Authorization: localStorage.getItem("jwtIASToken"),
              }}
              defaultFileList={proveForm.getFieldValue("constructionUnit")}
              onChange={(e) => handleChange(e, "constructionUnit")}
            >
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="salaryCertification"
            label="施工资格证明"
            rules={[
              {
                required: true,
                message: "施工资格证明不能为空",
              },
            ]}
            valuePropName="salaryCertification"
            getValueFromEvent={(e) =>
              normFile(e, proveForm.getFieldValue("salaryCertification"))
            }
          >
            <Upload
              name="file"
              action={`${getBaseUrl().baseURL}file/upload`}
              headers={{
                Authorization: localStorage.getItem("jwtIASToken"),
              }}
              defaultFileList={proveForm.getFieldValue("salaryCertification")}
              onChange={(e) => handleChange(e, "salaryCertification")}
            >
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="idNumberFiles"
            label="法人身份证"
            rules={[
              {
                required: true,
                message: "法人身份证不能为空",
              },
            ]}
            valuePropName="idNumberFiles"
            getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              action={`${getBaseUrl().baseURL}file/upload`}
              headers={{
                Authorization: localStorage.getItem("jwtIASToken"),
              }}
              defaultFileList={proveForm.getFieldValue("idNumberFiles")}
              onChange={(e) => handleChange(e, "idNumberFiles")}
            >
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="electricianQualification"
            label="电工及特殊工种资格证"
            rules={[
              {
                required: true,
                message: "电工及特殊工种资格证不能为空",
              },
            ]}
            valuePropName="electricianQualification"
            getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              action={`${getBaseUrl().baseURL}file/upload`}
              headers={{
                Authorization: localStorage.getItem("jwtIASToken"),
              }}
              defaultFileList={proveForm.getFieldValue(
                "electricianQualification"
              )}
              onChange={(e) => handleChange(e, "electricianQualification")}
            >
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="constructionManagerID"
            label="施工负责人身份证"
            rules={[
              {
                required: true,
                message: "施工负责人身份证不能为空",
              },
            ]}
            valuePropName="constructionManagerID"
            getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              action={`${getBaseUrl().baseURL}file/upload`}
              headers={{
                Authorization: localStorage.getItem("jwtIASToken"),
              }}
              defaultFileList={proveForm.getFieldValue("constructionManagerID")}
              onChange={(e) => handleChange(e, "constructionManagerID")}
            >
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="boothConstructionDrawings"
            label="展台搭建图纸 如:《平面图》《立面图》"
            rules={[
              {
                required: true,
                message: "展台搭建图纸 如:《平面图》《立面图》不能为空",
              },
            ]}
            valuePropName="boothConstructionDrawings"
            getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              action={`${getBaseUrl().baseURL}file/upload`}
              headers={{
                Authorization: localStorage.getItem("jwtIASToken"),
              }}
              defaultFileList={proveForm.getFieldValue(
                "boothConstructionDrawings"
              )}
              onChange={(e) => handleChange(e, "boothConstructionDrawings")}
            >
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="copyBoothInsurancePolicy"
            label="《展台保险单复印件》"
            rules={[
              {
                required: true,
                message: "《展台保险单复印件》不能为空",
              },
            ]}
            valuePropName="copyBoothInsurancePolicy"
            getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              action={`${getBaseUrl().baseURL}file/upload`}
              headers={{
                Authorization: localStorage.getItem("jwtIASToken"),
              }}
              defaultFileList={proveForm.getFieldValue(
                "copyBoothInsurancePolicy"
              )}
              onChange={(e) => handleChange(e, "copyBoothInsurancePolicy")}
            >
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="exhibitorManualAttachment"
            label="《参展商手册附件》"
            rules={[
              {
                required: true,
                message: "《参展商手册附件》不能为空",
              },
            ]}
            valuePropName="exhibitorManualAttachment"
            getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              action={`${getBaseUrl().baseURL}file/upload`}
              headers={{
                Authorization: localStorage.getItem("jwtIASToken"),
              }}
              defaultFileList={proveForm.getFieldValue(
                "exhibitorManualAttachment"
              )}
              onChange={(e) => handleChange(e, "exhibitorManualAttachment")}
            >
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="file1"
            label="《桁架结构计算书》《双层结构计算书》"
            valuePropName="file1"
            getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              action={`${getBaseUrl().baseURL}file/upload`}
              headers={{
                Authorization: localStorage.getItem("jwtIASToken"),
              }}
              defaultFileList={proveForm.getFieldValue("file1")}
              onChange={(e) => handleChange(e, "file1")}
            >
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="otherFile"
            label="其它"
            valuePropName="otherFile"
            getValueFromEvent={normFile}
          >
            <Upload
              name="file"
              action={`${getBaseUrl().baseURL}file/upload`}
              headers={{
                Authorization: localStorage.getItem("jwtIASToken"),
              }}
              defaultFileList={proveForm.getFieldValue("otherFile")}
              onChange={(e) => handleChange(e, "otherFile")}
            >
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
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
