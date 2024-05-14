import React, { useContext, useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  DatePicker,
  Col,
  Row,
  Upload,
  Popconfirm,
  message,
  Tooltip,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  getMaterialList,
  getMaterialInfo,
  postUpdateCollectFee,
} from "../../../../api/api";
import { getBaseUrl } from "../../../../config";
import { hourTimeValue, approvalStatusToChinese } from "../../../../util/util";
import "./Cost.css";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
dayjs.locale("zh-cn");
const { RangePicker } = DatePicker;

const normFile = (e) => {
  // console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  const list = [];
  for (const item of e?.fileList) {
    if (item.status === "done") {
      list.push(item.response.data);
    }
  }
  return list.length ? list : e?.fileList;
};

const materialFieldNames = {
  label: "materialName",
  value: "id",
};

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  type,
  children,
  dataIndex,
  record,
  handleSave,
  options,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const selectRef = useRef(null);
  const timeRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing && type !== "time") {
      switch (type) {
        case "select":
          selectRef.current.focus();
          break;
        default:
          inputRef.current.focus();
          break;
      }
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      if (dataIndex === "materialName") {
        const res = await getMaterialInfo(form.getFieldValue(dataIndex));
        if (res && res.code === 200) {
          values.feeCategory = res.data.feeCategory;
          values.specification = res.data.specification;
          values.unit = res.data.unit;
          values.deposit = res.data.deposit;
          values.totalDepositAmount = res.data.deposit;
          values.unitPrice = res.data.unitPrice;
          values.totalCost = res.data.unitPrice;
          toggleEdit();
          handleSave({
            ...record,
            ...values,
          });
        }
      } else if (dataIndex === "quantity") {
        values.totalCost =
          Number(values.quantity) === 0 ? 1 : Number(values.quantity) *
          Number(record.unitPrice) *
          (Number(record.duration) ? Number(record.duration) : 1);
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } else {
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      }
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    switch (type) {
      case "select":
        childNode = editing ? (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `物料名称不能为空`,
              },
            ]}
          >
            <Select
              value={children}
              ref={selectRef}
              onChange={() => save("materialName")}
              onBlur={() => save("materialName")}
              options={options}
              fieldNames={materialFieldNames}
              optionRender={(option) => (
                <div>
                  <Tooltip placement="top" title={option.data.materialName}>
                    <div>{option.data.materialName}</div>
                  </Tooltip>
                  <Tooltip placement="bottom" title={option.data.assembleText}>
                    <div className="select-tip">{option.data.assembleText}</div>
                  </Tooltip>
                </div>
              )}
            />
          </Form.Item>
        ) : (
          <div
            className="editable-cell-value-wrap"
            style={{
              paddingRight: 24,
            }}
            onClick={toggleEdit}
          >
            {children}
          </div>
        );
        break;
      case "time":
        childNode = editing ? (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `${title}不能为空`,
              },
            ]}
          >
            <DatePicker
              value={children}
              showTime
              ref={timeRef}
              format={"YYYY-MM-DD HH:00:00"}
              onChange={save}
              onOk={save}
            />
          </Form.Item>
        ) : (
          <div
            className="editable-cell-value-wrap"
            style={{
              paddingRight: 24,
            }}
            onClick={toggleEdit}
          >
            {children}
          </div>
        );
        break;
      case "num":
        childNode = editing ? (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `${title}不能为空`,
              },
            ]}
          >
            <InputNumber
              min={0}
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
            />
          </Form.Item>
        ) : (
          <div
            className="editable-cell-value-wrap"
            style={{
              paddingRight: 24,
            }}
            onClick={toggleEdit}
          >
            {children}
          </div>
        );
        break;
      default:
        childNode = editing ? (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `${title}不能为空`,
              },
            ]}
          >
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          </Form.Item>
        ) : (
          <div
            className="editable-cell-value-wrap"
            style={{
              paddingRight: 24,
            }}
            onClick={toggleEdit}
          >
            {children}
          </div>
        );
        break;
    }
  }
  return <td {...restProps}>{childNode}</td>;
};
export default function Cost(props) {
  const goodsInfo = props.goodsInfo;
  const [isShow, setIsShow] = useState(false);
  const [costForm] = Form.useForm();
  const [dueFee, setDueFee] = useState(0);
  const [dueDeposit, setDueDeposit] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(0);
  const materialList = props.getMaterialList;
  const dataForm = props.setDataForm;
  const setData = () => {
    if (
      dataForm.collectFeeVO !== null &&
      dataForm.collectFeeVO.collectFeeForm !== null &&
      dataForm.collectFeeVO.collectFeeForm.collectFeeListVO !== null
    ) {
      const dataSubmitSource =
        dataForm.collectFeeVO.collectFeeForm.collectFeeListVO;
      let dueFee = 0;
      let dueDeposit = 0;
      for (const i in dataSubmitSource) {
        dataSubmitSource[i].key = i;
        dataSubmitSource[i].startTime = dataSubmitSource[i].startTime
          ? dayjs(dataSubmitSource[i].startTime)
          : "";
        dataSubmitSource[i].endTime = dataSubmitSource[i].endTime
          ? dayjs(dataSubmitSource[i].endTime)
          : "";
        dataSubmitSource[i].totalDepositAmount = dataSubmitSource[i].deposit;
        dataSubmitSource[i].totalCost =
          Number(dataSubmitSource[i].quantity) === 0 ? 1 : Number(dataSubmitSource[i].quantity) *
          Number(dataSubmitSource[i].unitPrice) *
          (Number(dataSubmitSource[i].duration)
            ? Number(dataSubmitSource[i].duration)
            : 1);
        dueFee += dataSubmitSource[i].totalCost;
        dueDeposit += dataSubmitSource[i].totalDepositAmount;
        if (
          typeof dataSubmitSource[i].materialName === "string" ||
          dataSubmitSource[i].materialName === null ||
          !dataSubmitSource[i].materialName
        )
          continue;
        dataSubmitSource[i].materialName = dataSubmitSource[i].materialName.id;
      }
      if (
        dataForm.collectFeeVO.collectFeeForm.file1 !== null &&
        typeof dataForm.collectFeeVO.collectFeeForm.file1 === "object"
      ) {
        for (const item of dataForm.collectFeeVO.collectFeeForm.file1) {
          item.uid = item.id;
          item.status = "done";
        }
      } else {
        dataForm.collectFeeVO.collectFeeForm.file1 = [];
      }
      setDataSource(dataSubmitSource);
      setCount(dataSubmitSource.length);
      setDueFee(dueFee);
      setDueDeposit(dueDeposit);
      costForm.setFieldValue(
        "attachment",
        dataForm.collectFeeVO.collectFeeForm.file1
      );
    }
    setIsShow(true);
  };
  useEffect(() => {
    setData();
  }, [props.getMaterialList]);

  const checkedForm = () => {
    const data = dataSource.concat;
    if (data.length) {
      props.changeCheck("costForm", true);
    } else {
      props.changeCheck("costForm", false);
    }
  };
  useEffect(() => {
    if (props.check) {
      checkedForm();
    }
  }, [props.check]);

  // const handleMaterialList = async () => {
  //   const data = goodsInfo.projectNumber;
  //   if (!data) return;
  //   const res = await getMaterialList(data);
  //   if (res && res.code === 200) {
  //     setMaterialList(res.data);
  //   }
  // };
  // useEffect(() => {
  //   handleMaterialList();
  // }, [goodsInfo]);
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    onFormChange();
  };
  // const onBeginTimeChange = (data, dateString, index) => {
  //   dataSource[index].startTime = dateString;
  //   if (
  //     dataSource[index].endTime &&
  //     new Date(dataSource[index].startTime).getTime() <
  //       new Date(dataSource[index].endTime).getTime()
  //   ) {
  //     dataSource[index].duration = hourTimeValue(
  //       dataSource[index].startTime,
  //       dataSource[index].endTime
  //     );
  //     dataSource[index].totalCost =
  //       Number(dataSource[index].quantity) *
  //       Number(dataSource[index].unitPrice) *
  //       (Number(dataSource[index].duration)
  //         ? Number(dataSource[index].duration)
  //         : 1);
  //   }
  //   setDataSource([...dataSource]);
  //   onFormChange();
  // };
  const onTimeChange = (data, dateString, index) => {
    dataSource[index].startTime = dateString[0];
    dataSource[index].endTime = dateString[1];
    dataSource[index].duration = hourTimeValue(
      dataSource[index].startTime,
      dataSource[index].endTime
    );
    dataSource[index].totalCost =
      Number(dataSource[index].quantity) === 0 ? 1 : Number(dataSource[index].quantity) *
      Number(dataSource[index].unitPrice) *
      (Number(dataSource[index].duration)
        ? Number(dataSource[index].duration)
        : 1);
    setDataSource([...dataSource]);
    onFormChange();
  };
  // const onEndTimeChange = (data, dateString, index) => {
  //   dataSource[index].endTime = dateString;
  //   if (
  //     dataSource[index].startTime &&
  //     new Date(dataSource[index].startTime).getTime() <
  //       new Date(dataSource[index].endTime).getTime()
  //   ) {
  //     dataSource[index].duration = hourTimeValue(
  //       dataSource[index].startTime,
  //       dataSource[index].endTime
  //     );
  //     dataSource[index].totalCost =
  //       Number(dataSource[index].quantity) *
  //       Number(dataSource[index].unitPrice) *
  //       (Number(dataSource[index].duration)
  //         ? Number(dataSource[index].duration)
  //         : 1);
  //   }
  //   setDataSource([...dataSource]);
  //   onFormChange();
  // };
  const onRemarksChange = (e, index) => {
    dataSource[index].remarks = e.target.value;
    setDataSource([...dataSource]);
    onFormChange();
  };
  const defaultColumns = [
    {
      title: (
        <div>
          物料名称<span style={{ color: "red" }}>*</span>
        </div>
      ),
      dataIndex: "materialName",
      width: 200,
      editable: true,
      type: "select",
      options: materialList,
      render: (_, record, index) => (
        <Select
          value={record.materialName}
          options={materialList}
          fieldNames={materialFieldNames}
          optionRender={(option) => (
            <div>
              <Tooltip placement="top" title={option.data.materialName}>
                <div>{option.data.materialName}</div>
              </Tooltip>
              <Tooltip placement="bottom" title={option.data.assembleText}>
                <div className="select-tip">{option.data.assembleText}</div>
              </Tooltip>
            </div>
          )}
        />
      ),
    },
    {
      title: "费用类别",
      dataIndex: "feeCategory",
      width: 180,
    },
    {
      title: "规格",
      dataIndex: "specification",
      width: 150,
    },
    {
      title: "单位",
      dataIndex: "unit",
      width: 150,
    },
    {
      title: "起止时间",
      dataIndex: "startTime",
      width: 400,
      render: (_, record, index) => (
        <RangePicker
          showTime={{
            format: "HH:00",
          }}
          defaultValue={[record.startTime, record.endTime]}
          format="YYYY-MM-DD HH:00"
          onChange={(data, dateString) => onTimeChange(data, dateString, index)}
        />
      ),
    },
    // {
    //   title: "起始时间",
    //   dataIndex: "startTime",
    //   width: 200,
    //   type: "time",
    //   render: (_, record, index) => (
    //     <DatePicker
    //       showTime
    //       defaultValue={_}
    //       format={"YYYY-MM-DD HH:00"}
    //       onChange={(data, dateString) =>
    //         onBeginTimeChange(data, dateString, index)
    //       }
    //     />
    //   ),
    // },
    // {
    //   title: "结束时间",
    //   dataIndex: "endTime",
    //   width: 200,
    //   type: "time",
    //   render: (_, record, index) => (
    //     <DatePicker
    //       defaultValue={_}
    //       format={"YYYY-MM-DD HH:00"}
    //       showTime
    //       onChange={(data, dateString) =>
    //         onEndTimeChange(data, dateString, index)
    //       }
    //     />
    //   ),
    // },
    {
      title: (
        <div>
          数量<span style={{ color: "red" }}>*</span>
        </div>
      ),
      dataIndex: "quantity",
      width: 150,
      editable: true,
      type: "num",
      render: (_) => <InputNumber min={0} value={_} />,
    },
    {
      title: "时长",
      dataIndex: "duration",
      width: 120,
    },
    {
      title: "押金",
      dataIndex: "deposit",
      width: 120,
    },
    {
      title: "单价",
      dataIndex: "unitPrice",
      width: 200,
    },
    {
      title: "费用合计",
      dataIndex: "totalCost",
      width: 120,
    },
    {
      title: "押金合计",
      dataIndex: "totalDepositAmount",
      width: 120,
    },
    {
      title: "备注",
      dataIndex: "remarks",
      editable: true,
      width: 200,
      render: (_, record, index) => (
        <Input value={_} onChange={(e) => onRemarksChange(e, index)} />
      ),
    },
    {
      title: "操作",
      dataIndex: "operation",
      fixed: "right",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>删除</a>
          </Popconfirm>
        ) : null,
    },
  ];
  const submitColumns = [
    {
      title: (
        <div>
          物料名称<span style={{ color: "red" }}>*</span>
        </div>
      ),
      dataIndex: "materialName",
      width: 200,
      render: (_, record, index) => (
        <Select
          disabled={true}
          value={record.materialName}
          options={materialList}
          fieldNames={materialFieldNames}
        />
      ),
    },
    {
      title: "费用类别",
      dataIndex: "feeCategory",
      width: 180,
    },
    {
      title: "规格",
      dataIndex: "specification",
      width: 150,
    },
    {
      title: "单位",
      dataIndex: "unit",
      width: 150,
    },
    {
      title: "起止时间",
      dataIndex: "startTime",
      width: 200,
      render: (_, record, index) => (
        <RangePicker
          disabled={true}
          showTime={{
            format: "HH:00",
          }}
          defaultValue={[record.startTime, record.endTime]}
          format="YYYY-MM-DD HH:00"
          onChange={(data, dateString) => onTimeChange(data, dateString, index)}
        />
      ),
    },
    // {
    //   title: "起始时间",
    //   dataIndex: "startTime",
    //   width: 200,
    //   render: (_, record, index) => (
    //     <DatePicker
    //       disabled={true}
    //       showTime
    //       defaultValue={_}
    //       format={"YYYY-MM-DD HH:00"}
    //       onChange={(data, dateString) =>
    //         onBeginTimeChange(data, dateString, index)
    //       }
    //     />
    //   ),
    // },
    // {
    //   title: "结束时间",
    //   dataIndex: "endTime",
    //   width: 200,
    //   render: (_, record, index) => (
    //     <DatePicker
    //       disabled={true}
    //       defaultValue={_}
    //       format={"YYYY-MM-DD HH:00"}
    //       showTime
    //       onChange={(data, dateString) =>
    //         onEndTimeChange(data, dateString, index)
    //       }
    //     />
    //   ),
    // },
    {
      title: (
        <div>
          数量<span style={{ color: "red" }}>*</span>
        </div>
      ),
      dataIndex: "quantity",
      width: 150,
      editable: true,
    },
    {
      title: "时长",
      dataIndex: "duration",
      width: 120,
    },
    {
      title: "押金",
      dataIndex: "deposit",
      width: 120,
    },
    {
      title: "单价",
      dataIndex: "unitPrice",
      width: 200,
    },
    {
      title: "费用合计",
      dataIndex: "totalCost",
      width: 120,
    },
    {
      title: "押金合计",
      dataIndex: "totalDepositAmount",
      width: 120,
    },
    {
      title: "备注",
      dataIndex: "remarks",
      width: 200,
    },
    // {
    //   title: "操作",
    //   dataIndex: "operation",
    //   render: (_, record) =>
    //     dataSource.length >= 1 ? (
    //       <Popconfirm
    //         title="确定删除吗？"
    //         onConfirm={() => handleDelete(record.key)}
    //       >
    //         <a>删除</a>
    //       </Popconfirm>
    //     ) : null,
    // },
  ];
  const handleAdd = () => {
    const newData = {
      key: count,
      materialName: "",
      feeCategory: "",
      specification: "",
      unit: "",
      startTime: "",
      endTime: "",
      quantity: 1,
      duration: "",
      deposit: "",
      remarks: "",
      unitPrice: "",
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
    onFormChange();
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
    getAddFee();
    onFormChange();
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        type: col.type,
        options: col.options,
        handleSave,
      }),
    };
  });

  const getAddFee = () => {
    let dueFee = 0;
    let dueDeposit = 0;
    for (const item of dataSource) {
      dueFee += Number(item.totalCost);
      dueDeposit += Number(item.totalDepositAmount);
    }
    if (dueFee) setDueFee(dueFee);
    if (dueDeposit) setDueDeposit(dueDeposit);
    onFormChange();
  };
  const onValuesChange = (value) => {
    const collectFeeDTOList = dataSource;
    const data = {
      collectFeeDTOList,
      attachment: costForm.getFieldValue("attachment"),
      totalDepositAmount: dueDeposit,
      totalCost: dueFee,
    };
    props.costForm(data);
  };
  const onChangCostForm = async () => {
    const collectFeeDTOList = dataSource;
    for (const item in collectFeeDTOList) {
      if (typeof collectFeeDTOList[item].startTime === "object") {
        collectFeeDTOList[item].startTime = dayjs(
          collectFeeDTOList[item].startTime
        ).format("YYYY-MM-DD hh:mm");
      }
      if (typeof collectFeeDTOList[item].endTime === "object") {
        collectFeeDTOList[item].endTime = dayjs(
          collectFeeDTOList[item].endTime
        ).format("YYYY-MM-DD hh:mm");
      }
      if (typeof collectFeeDTOList[item].materialName === "object") continue;
      const materialName = {
        id: collectFeeDTOList[item].materialName,
      };
      collectFeeDTOList[item].materialName = materialName;
    }
    const data = {
      id: dataForm.collectFeeVO.id,
      orderNumber: goodsInfo.orderNumber,
      investmentExhibitionDetailNumber:
        goodsInfo.investmentExhibitionDetailNumber,
      collectFeeDTOList,
      changeChargeSheet: "y",
      attachment: costForm.getFieldValue("attachment"),
      totalDepositAmount: dueDeposit,
      totalCost: dueFee,
    };
    const res = await postUpdateCollectFee(data);
    if (res && res.code === 200) {
      message.success("提交成功");
    }
  };
  useEffect(() => {
    getAddFee();
  }, [dataSource]);
  const onFormChange = () => {
    let dueFee = 0;
    let dueDeposit = 0;
    for (const item of dataSource) {
      dueFee += Number(item.totalCost);
      dueDeposit += Number(item.totalDepositAmount);
    }
    const data = {
      collectFeeDTOList: dataSource,
      attachment: costForm.getFieldValue("attachment"),
      totalDepositAmount: dueDeposit,
      totalCost: dueFee,
    };
    props.costForm(data);
    // props.changeCheck(false);
  };
  const handleChange = (info, name) => {
    if (info.file.status === "done") {
      let list = [];
      for (const item of info.fileList) {
        if (item.status === "done") {
          if ("response" in item) {
            const uploadData = item.response.data;
            uploadData.uid = uploadData.id;
            list.push(uploadData);
          } else {
            list.push(item);
          }
        }
      }
      costForm.setFieldValue(name, list);
      onValuesChange();
    }
  };
  if (!isShow) return;
  return (
    <div className="cost-warp">
      <Table
        pagination={false}
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={goodsInfo.auditStatus === "1" ? submitColumns : columns}
        scroll={{
          x: 2300,
        }}
      />
      <Button
        onClick={handleAdd}
        type="link"
        icon={<PlusOutlined />}
        style={{
          marginBottom: 16,
        }}
      >
        添加物资明细
      </Button>
      <Row gutter={24}>
        <Col span={12}>应收费用：{dueFee}</Col>
        <Col span={12}>应收押金：{dueDeposit}</Col>
        <Col span={24}>
          {goodsInfo.auditStatus === "1" ||
          goodsInfo.auditStatus === "3" ||
          (goodsInfo.auditStatus === "2" &&
            dataForm.collectFeeVO !== null &&
            dataForm.collectFeeVO.approvalStatus === "approve") ? (
            <Form
              disabled={
                goodsInfo.auditStatus === "1" ||
                goodsInfo.auditStatus === "3" ||
                (goodsInfo.auditStatus === "2" &&
                  dataForm.collectFeeVO !== null &&
                  dataForm.collectFeeVO.approvalStatus === "approve")
              }
              layout="vertical"
              labelAlign="left"
              form={costForm}
              name="cost"
              onValuesChange={onValuesChange}
            >
              <Form.Item
                name="attachment"
                label="附件："
                valuePropName="attachment"
                getValueFromEvent={normFile}
              >
                <Upload
                  name="file"
                  action={`${getBaseUrl().baseURL}file/upload`}
                  headers={{
                    Authorization: localStorage.getItem("jwtIASToken"),
                  }}
                  fileList={costForm.getFieldValue("attachment")}
                >
                  <Button icon={<UploadOutlined />}>点击上传</Button>
                </Upload>
                {costForm.getFieldValue("file1")
                  ? costForm.getFieldValue("file1").map((item, index) => {
                      return (
                        <div style={{ marginTop: "4px" }} key={index}>
                          {item.name}
                        </div>
                      );
                    })
                  : null}
              </Form.Item>
            </Form>
          ) : (
            <Form
              layout="vertical"
              labelAlign="left"
              form={costForm}
              name="cost"
              onValuesChange={onValuesChange}
            >
              <Form.Item
                name="attachment"
                label="附件："
                valuePropName="attachment"
                getValueFromEvent={normFile}
              >
                <Upload
                  name="file"
                  action={`${getBaseUrl().baseURL}file/upload`}
                  headers={{
                    Authorization: localStorage.getItem("jwtIASToken"),
                  }}
                  defaultFileList={costForm.getFieldValue("attachment")}
                  onChange={(e) => handleChange(e, "attachment")}
                >
                  <Button icon={<UploadOutlined />}>点击上传</Button>
                </Upload>
              </Form.Item>
            </Form>
          )}

          {goodsInfo.auditStatus === "3" ? (
            <Form.Item style={{ textAlign: "right" }}>
              <Button onClick={onChangCostForm} type="primary">
                提交变更
              </Button>
            </Form.Item>
          ) : null}
        </Col>
        {dataForm.collectFeeVO !== null &&
        dataForm.collectFeeVO.approvalStatus !== null ? (
          <Row className="cost-item-row">
            <Col span={12}>
              费用转账：{dataForm.collectFeeVO.collectFeeForm.feeTransfer}
            </Col>
            <Col span={12}>
              押金转账：{dataForm.collectFeeVO.collectFeeForm.depositTransfer}
            </Col>
            <Col span={12}>
              费用现金：{dataForm.collectFeeVO.collectFeeForm.feeCash}
            </Col>
            <Col span={12}>
              押金现金：{dataForm.collectFeeVO.collectFeeForm.depositCash}
            </Col>
            <Col span={12}>
              实收现金：{dataForm.collectFeeVO.collectFeeForm.receivedCash}
            </Col>
            <Col span={12}>
              实收转账：{dataForm.collectFeeVO.collectFeeForm.receivedTransfer}
            </Col>
            <Col span={12}>
              实收费用：{dataForm.collectFeeVO.collectFeeForm.actualFee}
            </Col>
            <Col span={12}>
              实收押金：{dataForm.collectFeeVO.collectFeeForm.actualDeposit}
            </Col>
            <Col span={12}>
              应收合计：{dataForm.collectFeeVO.collectFeeForm.dueAmount}
            </Col>
            <Col span={12}>
              实收合计：{dataForm.collectFeeVO.collectFeeForm.receivedAmount}
            </Col>
            <Col span={12}>
              减免：{dataForm.collectFeeVO.collectFeeForm.discount}
            </Col>
            <Col span={12}>
              未收合计：{dataForm.collectFeeVO.collectFeeForm.unreceivedAmount}
            </Col>
            <Col span={12}>
              补充：{dataForm.collectFeeVO.collectFeeForm.supplement}
            </Col>
          </Row>
        ) : null}
      </Row>
      {dataForm.collectFeeVO !== null && goodsInfo.auditStatus !== "0" ? (
        <Row className="approval-warp">
          <Col span={24}>审核记录</Col>
          <Col span={4}>审核结果</Col>
          <Col span={8}>审核时间</Col>
          <Col span={12}>审核意见</Col>
          <Col span={4}>
            {approvalStatusToChinese(dataForm.collectFeeVO.approvalStatus)}
          </Col>
          <Col span={8}>{dataForm.collectFeeVO.approvalDateTime}</Col>
          <Col span={12}>{dataForm.collectFeeVO.approvalOpinion}</Col>
        </Row>
      ) : null}
    </div>
  );
}
