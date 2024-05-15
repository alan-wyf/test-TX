"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { Button, Input, Modal, Table, message, Tooltip } from "antd";
import { postInviteCode, postProjectList } from "../../api/api";
import { getBaseUrl } from "../../config";
import Header from "../components/header/Header";

const onloadFile = (url) => {
  let link = document.createElement("a");
  link.href = url;
  // link.target = '_blank'
  link.click();
};

export default function Index() {
  const navigate = useNavigate();
  const [addGoodsErrMsg, setAddGoodsErrMsg] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectNumber, setProjectNumber] = useState("");
  const [code, setCode] = useState(null);
  const [data, setData] = useState({
    total: 0,
    list: [],
  });
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = async () => {
    setLoading(true);
    const data = {
      projectName: projectName,
      projectNumber: projectNumber,
      pageNum: tableParams.pagination.current,
      pageSize: tableParams.pagination.pageSize,
    };
    await postProjectList(data)
      .then((res) => {
        if (!res) {
          setLoading(false);
          message.error("获取数据失败");
        } else {
          if (res && res.code === 200) {
            setData(res.data);
            setLoading(false);
          } else {
            setLoading(false);
          }
        }
      })
      .catch((res) => {
        console.log("err", res);
      });
  };

  useEffect(() => {
    fetchData();
  }, [
    JSON.stringify(
      JSON.stringify({
        projectName: projectName,
        projectNumber: projectNumber,
      })
    ),
  ]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };
  const handlePageChange = (page, e) => {
    tableParams.pagination.current = page;
    setTableParams(tableParams);
  };
  const onNameSearch = (e) => {
    setProjectName(e.target.value);
  };

  const onCodeSearch = (e) => {
    setProjectNumber(e.target.value);
  };

  const onCodeChange = (e) => {
    setCode(e.target.value);
  };

  const onAddModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handleAddOk = async () => {
    if (!code.replace(/\s+/g, "")) {
      setAddGoodsErrMsg("邀请码不能为空");
    } else {
      const data = {
        invitationCode: code,
      };
      const res = await postInviteCode(data);
      if (res && res.code === 200) {
        setIsAddModalOpen(false);
        setAddGoodsErrMsg("");
        fetchData();
      } else {
        setAddGoodsErrMsg(res.msg);
      }
    }
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
    setAddGoodsErrMsg("");
  };

  const onDetailClick = (e, record) => {
    e.stopPropagation();
    if (!record.expirationDate) {
      navigate(`/detail?id=` + record.investmentExhibitionDetailNumber);
      return;
    }
    if (
      new Date().getTime() > new Date(record.expirationDate).getTime() &&
      (record.auditStatus === "0" || record.auditStatus === "2")
    ) {
      Modal.warning({
        title: "报馆时间已截止，如有需求请与组委会工作人员联系",
      });
    } else {
      navigate(`/detail?id=` + record.investmentExhibitionDetailNumber);
    }
  };

  const columns = [
    {
      title: "项目名称",
      dataIndex: "projectName",
      key: "projectName",
      ellipsis: true,
    },
    {
      title: "参展品牌",
      dataIndex: "brandName",
      key: "brandName",
      ellipsis: true,
    },
    {
      title: "项目编码",
      dataIndex: "projectNumber",
      key: "projectNumber",
      ellipsis: true,
    },
    {
      title: "开始日期",
      dataIndex: "startDate",
      key: "startDate",
      ellipsis: true,
    },
    {
      title: "结束日期",
      dataIndex: "endDate",
      key: "endDate",
      ellipsis: true,
    },
    {
      title: "项目状态",
      key: "auditStatus",
      dataIndex: "auditStatus",
      render: (auditStatus) => {
        switch (auditStatus) {
          case "0":
            return <div className="tag un-submit">资料未提交</div>;
          case "1":
            return <div className="tag submit">审核中</div>;
          case "2":
            return <div className="tag fail">被驳回</div>;
          case "3":
            return <div className="tag success">审核通过</div>;
          default:
            break;
        }
      },
    },
    {
      title: "邀请码",
      dataIndex: "invitationCode",
      key: "invitationCode",
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      width: 250,
      render: (_, record) => {
        if (record.auditStatus === "0" || record.auditStatus === "2") {
          return (
            <div>
              <Button type="link" onClick={(e) => onDetailClick(e, record)}>
                提交资料
              </Button>
              {record.hasAttachment ? (
                <Button
                  type="link"
                  disabled={!record.hasAttachment}
                  onClick={() =>
                    onloadFile(
                      getBaseUrl().baseURL +
                        `project/down/${record.projectNumber}`
                    )
                  }
                >
                  报馆相关资料下载
                </Button>
              ) : (
                <Tooltip placement="top" title="本项目暂未添加报馆相关资料">
                  <Button
                    type="link"
                    disabled={!record.hasAttachment}
                    onClick={() =>
                      onloadFile(
                        getBaseUrl().baseURL +
                          `project/down/${record.projectNumber}`
                      )
                    }
                  >
                    报馆相关资料下载
                  </Button>
                </Tooltip>
              )}
            </div>
          );
        } else {
          return (
            <div>
              <Button type="link" onClick={(e) => onDetailClick(e, record)}>
                详情
              </Button>
              {record.hasAttachment ? (
                <Button
                  type="link"
                  disabled={!record.hasAttachment}
                  onClick={() =>
                    onloadFile(
                      getBaseUrl().baseURL +
                        `project/down/${record.projectNumber}`
                    )
                  }
                >
                  报馆相关资料下载
                </Button>
              ) : (
                <Tooltip placement="top" title="本项目暂未添加报馆相关资料">
                  <Button
                    type="link"
                    disabled={!record.hasAttachment}
                    onClick={() =>
                      onloadFile(
                        getBaseUrl().baseURL +
                          `project/down/${record.projectNumber}`
                      )
                    }
                  >
                    报馆相关资料下载
                  </Button>
                </Tooltip>
              )}
            </div>
          );
        }
      },
    },
  ];

  return (
    <div className="index-warp">
      <div className="index-warp-header">
        <Header />
      </div>
      <div className="index-warp-body">
        <div className="body-content">
          <div className="content-top">
            <div className="content-top-left">
              <Input
                className="search-input"
                placeholder="请输入项目名称"
                onChange={onNameSearch}
              />
              <Input
                className="search-input"
                placeholder="请输入项目编码"
                onChange={onCodeSearch}
              />
            </div>
            <div className="content-top-right">
              <Button
                className="add-btn"
                type="primary"
                onClick={onAddModalOpen}
              >
                添加参展品牌
              </Button>
            </div>
          </div>
          <div className="content-table">
            <Table
              columns={columns}
              dataSource={data.list}
              pagination={{
                current: tableParams.pagination.current, //当前页码
                pageSize: tableParams.pagination.pageSize, // 每页数据条数
                total: data.total, // 总条数
                onChange: (page) => handlePageChange(page), //改变页码的函数
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: [10, 20],
                hideOnSinglePage:
                  data.total > 10 && data.total < 20 ? false : true,
              }}
              loading={loading}
              onChange={handleTableChange}
              onRow={(record) => {
                return {
                  onClick: (e) => onDetailClick(e, record),
                };
              }}
            />
          </div>
        </div>
      </div>
      <Modal
        className="add-goods-model"
        title="添加参展品牌"
        open={isAddModalOpen}
        okText="确定"
        onOk={handleAddOk}
        cancelText="取消"
        onCancel={handleAddCancel}
        width={420}
        destroyOnClose={true}
      >
        <p className="add-goods-label">展会邀请码</p>
        <Input
          className="add-goods-input"
          placeholder="请输入"
          onChange={onCodeChange}
        />
        <p className="add-goods-label add-err-tip">{addGoodsErrMsg}</p>
      </Modal>
    </div>
  );
}
