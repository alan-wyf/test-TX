import React, { useContext, useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Select,
  Table,
  Col,
  Row,
  InputNumber,
  Popconfirm,
  DatePicker,
} from "antd";
import { getVehiclesList } from "../../../../api/api";
import { approvalStatusToChinese } from "../../../../util/util";
import dayjs from "dayjs";
import "./Car.css";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

const vehiclesFieldNames = {
  label: "value",
  value: "label",
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
    if (editing && type !== "select" && type !== "time") {
      inputRef.current.focus();
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
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
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
                message: `${title}不能为空`,
              },
            ]}
          >
            <Select
              value={children}
              ref={selectRef}
              onChange={save}
              options={options}
              fieldNames={vehiclesFieldNames}
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
  //   console.log({ ...restProps }, childNode);
  return <td {...restProps}>{childNode}</td>;
};
export default function Car(props) {
  const goodsInfo = props.goodsInfo;
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(0);
  const [vehiclesList, setVehiclesList] = useState([]);
  const dataForm = props.setDataForm;
  const setData = () => {
    if (dataForm.vehicleAccessVO === null) return;
    if (dataForm.vehicleAccessVO.vehicleAccessForm === null) return;
    const vehicleAccessListVO =
      dataForm.vehicleAccessVO.vehicleAccessForm.vehicleAccessListVO;
    for (const item in vehicleAccessListVO) {
      vehicleAccessListVO[item].key = item;
    }
    setCount(vehicleAccessListVO.length);
    setDataSource([...vehicleAccessListVO]);
  };
  useEffect(() => {
    setData();
  }, [props.setDataForm]);
  const checkedForm = () => {
    if (goodsInfo.isInputVehicle === "y") {
      if (dataSource.length) {
        props.changeCheck("carForm", true);
      } else {
        props.changeCheck("carForm", false);
      }
    } else {
      props.changeCheck("carForm", true);
    }
  };
  useEffect(() => {
    if (props.check) {
      checkedForm();
    }
  }, [props.check]);
  const handleVehiclesList = async () => {
    const res = await getVehiclesList();
    if (res && res.code === 200) {
      setVehiclesList(res.data);
    }
  };
  useEffect(() => {
    handleVehiclesList();
  }, []);
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    onFormChange();
  };
  const onLicensePlateNumberChange = (e, index) => {
    dataSource[index].licensePlateNumber = e.target.value;
    setDataSource([...dataSource]);
    onFormChange();
  };
  const defaultColumns = [
    {
      title: (
        <div>
          货车类型<span style={{ color: "red" }}>*</span>
        </div>
      ),
      dataIndex: "truckType",
      width: 230,
      editable: true,
      type: "select",
      options: vehiclesList,
      render: (_, record, index) => (
        <Select
          value={record.truckType}
          options={vehiclesList}
          fieldNames={vehiclesFieldNames}
        />
      ),
    },
    {
      title: (
        <div>
          数量<span style={{ color: "red" }}>*</span>
        </div>
      ),
      editable: true,
      width: 150,
      type: "num",
      dataIndex: "quantity",
      render: (_, record, index) => <InputNumber min={0} value={_} />,
    },
    {
      title: (
        <div>
          自卸数量<span style={{ color: "red" }}>*</span>
        </div>
      ),
      editable: true,
      width: 150,
      type: "num",
      dataIndex: "unloadQuantity",
      render: (_, record, index) => <InputNumber min={0} value={_} />,
    },
    {
      title: (
        <div>
          叉吊车卸货数量<span style={{ color: "red" }}>*</span>
        </div>
      ),
      editable: true,
      width: 150,
      type: "num",
      dataIndex: "forkliftUnloadQuantity",
      render: (_, record, index) => <InputNumber min={0} value={_} />,
    },
    {
      title: "车牌号",
      width: 230,
      type: 'input',
      dataIndex: "licensePlateNumber",
      render: (_, record, index) => (
        <Input
          value={_}
          onChange={(e) => onLicensePlateNumberChange(e, index)}
        />
      ),
    },
    {
      title: "操作",
      dataIndex: "operation",
      type: 'none',
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
      title: "货车类型",
      dataIndex: "truckType",
      width: 230,
      editable: true,
      type: "select",
      options: vehiclesList,
      render: (_, record, index) => (
        <Select
          disabled={true}
          value={record.truckType}
          options={vehiclesList}
          fieldNames={vehiclesFieldNames}
        />
      ),
    },
    {
      title: "数量",
      editable: true,
      width: 150,
      type: "num",
      dataIndex: "quantity",
    },
    {
      title: "自卸数量",
      width: 150,
      type: "num",
      dataIndex: "unloadQuantity",
    },
    {
      title: "叉吊车卸货数量",
      width: 150,
      type: "num",
      dataIndex: "forkliftUnloadQuantity",
    },
    {
      title: "车牌号",
      width: 230,
      type: "input",
      dataIndex: "licensePlateNumber",
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
      truckType: "",
      quantity: 1,
      unloadQuantity: 1,
      forkliftUnloadQuantity: 1,
      licensePlateNumber: "",
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
  const onFormChange = () => {
    // console.log(dataSource);
    props.carForm(dataSource);
    // props.changeCheck(false);
  };
  return (
    <div className="car-warp">
      {goodsInfo.auditStatus !== "0" ||
      (dataForm.vehicleAccessVO !== null &&
        dataForm.vehicleAccessVO.approvalStatus === "approve") ? (
        <div>
          <Table
            pagination={false}
            // components={components}
            bordered
            dataSource={dataSource}
            columns={submitColumns}
            scroll={{
              x: 1000,
            }}
          />
        </div>
      ) : (
        <div>
          <Table
            pagination={false}
            components={components}
            rowClassName={() => "editable-row"}
            bordered
            dataSource={dataSource}
            columns={columns}
            scroll={{
              x: 1000,
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
            添加
          </Button>
        </div>
      )}
      {dataForm.vehicleAccessVO !== null && goodsInfo.auditStatus !== "0" ? (
        <Row className="approval-warp">
          <Col span={24}>审核记录</Col>
          <Col span={4}>审核结果</Col>
          <Col span={8}>审核时间</Col>
          <Col span={12}>审核意见</Col>
          <Col span={4}>
            {approvalStatusToChinese(dataForm.vehicleAccessVO.approvalStatus)}
          </Col>
          <Col span={8}>{dataForm.vehicleAccessVO.approvalDateTime}</Col>
          <Col span={12}>{dataForm.vehicleAccessVO.approvalOpinion}</Col>
        </Row>
      ) : null}
    </div>
  );
}
