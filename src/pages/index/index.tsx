import React, { useState } from "react";
import {
  SearchOutlined,
  MoreOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Divider } from "antd";
import "./index.css";

// 会议状态类型
type ConferenceStatus = "ongoing" | "paused" | "upcoming" | "history";

// 会议项数据类型
interface ConferenceItem {
  id: string;
  status: ConferenceStatus;
  tags: { label: string; type: "default" | "orange" }[];
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  creators: string[];
  collaborators: string[];
  operator?: string;
  isExpanded?: boolean;
  subItems?: Omit<ConferenceItem, "subItems" | "status">[];
}

// 模拟会议数据
const conferenceData: ConferenceItem[] = [
  {
    id: "1",
    status: "ongoing",
    tags: [
      { label: "天美", type: "default" },
      { label: "王者荣耀", type: "orange" },
    ],
    title: "NGR流失访谈 >> Product",
    startTime: "2024-10-11 18:00:00",
    endTime: "2024-10-11 19:00:00",
    location: "端手游体验室(深圳-D1-0445)",
    creators: ["image", "image", "image", "image", "image", "image", "image"],
    collaborators: ["image", "image", "image", "image", "image", "image"],
  },
  {
    id: "2",
    status: "paused",
    tags: [
      { label: "天美", type: "default" },
      { label: "王者荣耀", type: "orange" },
    ],
    title: "NGR流失访谈 >> Dry5 MI",
    startTime: "2024-10-11 18:00:00",
    endTime: "2024-10-11 19:00:00",
    location: "端手游体验室(深圳-D1-0445)",
    creators: ["image", "image", "image", "image", "image"],
    collaborators: ["image", "image", "image", "image", "image"],
  },
  {
    id: "3",
    status: "upcoming",
    tags: [
      { label: "天美", type: "default" },
      { label: "王者荣耀", type: "orange" },
    ],
    title: "NGR流失访谈 >> Dry5 MI",
    startTime: "2024-10-11 18:00:00",
    endTime: "2024-10-11 19:00:00",
    location: "端手游体验室(深圳-D1-0445)",
    creators: ["image", "image", "image", "image", "image"],
    collaborators: ["image", "image", "image", "image", "image"],
  },
  {
    id: "4",
    status: "history",
    isExpanded: false,
    tags: [
      { label: "天美", type: "default" },
      { label: "王者荣耀", type: "orange" },
    ],
    title: "NGR流失访谈",
    startTime: "2024-08-16",
    endTime: "2024-08-17",
    location: "端手游体验室(深圳-D1-0445)",
    creators: ["image", "image", "image"],
    collaborators: ["image", "image", "image"],
    subItems: [
      {
        id: "4-1",
        tags: [],
        title: "NGR流失访谈-NPKR流失...",
        startTime: "2024-08-16 19:30",
        endTime: "2024-08-16 19:30",
        location: "端手游体验室(深圳-D1-0445)",
        creators: [],
        collaborators: [],
        operator: "luoxyang(杨晓丹)",
      },
      {
        id: "4-2",
        tags: [],
        title: "NGRP流失访谈MI",
        startTime: "2024-08-16 19:30",
        endTime: "2024-08-16 19:30",
        location: "端手游体验室(深圳-D1-0445)",
        creators: [],
        collaborators: [],
        operator: "luoxyang(杨晓丹)",
      },
      {
        id: "4-3",
        tags: [],
        title: "NGR流失访谈(3)",
        startTime: "2024-08-16 19:30",
        endTime: "2024-08-16 19:30",
        location: "端手游体验室(深圳-D1-0445)",
        creators: [],
        collaborators: [],
        operator: "luoxyang(杨晓丹)",
      },
      {
        id: "4-4",
        tags: [],
        title: "NGRP流失访谈(2)",
        startTime: "2024-08-16 19:30",
        endTime: "2024-08-16 19:30",
        location: "端手游体验室(深圳-D1-0445)",
        creators: [],
        collaborators: [],
        operator: "luoxyang(杨晓丹)",
      },
      {
        id: "4-5",
        tags: [],
        title: "NGRP流失访谈(1)",
        startTime: "2024-08-16 19:30",
        endTime: "2024-08-16 19:30",
        location: "端手游体验室(深圳-D1-0445)",
        creators: [],
        collaborators: [],
        operator: "luoxyang(杨晓丹)",
      },
      {
        id: "4-6",
        tags: [],
        title: "test",
        startTime: "2024-08-16 19:30",
        endTime: "2024-08-16 19:30",
        location: "端手游体验室(深圳-D1-0445)",
        creators: [],
        collaborators: [],
        operator: "luoxyang(杨晓丹)",
      },
    ],
  },
  {
    id: "5",
    status: "history",
    isExpanded: false,
    tags: [
      { label: "天美", type: "default" },
      { label: "王者荣耀", type: "orange" },
    ],
    title: "NGR流失访谈-NPKR流失访谈-NGRP流失访谈...",
    startTime: "2024-08-11",
    endTime: "2024-08-16",
    location: "端手游体验室(深圳-D1-0445)",
    creators: [],
    collaborators: [],
  },
  {
    id: "6",
    status: "history",
    isExpanded: false,
    tags: [
      { label: "天美", type: "default" },
      { label: "王者荣耀", type: "orange" },
    ],
    title: "NGR流失访谈",
    startTime: "2024-08-11",
    endTime: "2024-08-14",
    location: "端手游体验室(深圳-D1-0445)",
    creators: ["image", "image", "image"],
    collaborators: ["image", "image", "image"],
  },
  {
    id: "7",
    status: "history",
    isExpanded: false,
    tags: [
      { label: "天美", type: "default" },
      { label: "王者荣耀", type: "orange" },
    ],
    title: "NGR流失访谈",
    startTime: "2024-08-08",
    endTime: "2024-08-10",
    location: "端手游体验室(深圳-D1-0445)",
    creators: ["image", "image", "image"],
    collaborators: ["image", "image", "image"],
  },
  {
    id: "8",
    status: "history",
    isExpanded: false,
    tags: [
      { label: "天美", type: "default" },
      { label: "王者荣耀", type: "orange" },
    ],
    title: "NGR流失访谈",
    startTime: "2024-08-08",
    endTime: "2024-08-10",
    location: "端手游体验室(深圳-D1-0445)",
    creators: ["image", "image", "image"],
    collaborators: ["image", "image", "image"],
  },
];

const ConferencePage: React.FC = () => {
  const [conferences, setConferences] =
    useState<ConferenceItem[]>(conferenceData);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // 切换历史记录展开状态
  const toggleHistoryExpand = (id: string) => {
    setConferences(
      conferences.map((item) =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  // 获取状态对应的CSS类名
  const getStatusClassName = (status: ConferenceStatus) => {
    switch (status) {
      case "ongoing":
        return "conference-item--ongoing";
      case "paused":
        return "conference-item--paused";
      case "upcoming":
        return "conference-item--upcoming";
      case "history":
        return "conference-item--history";
      default:
        return "";
    }
  };

  // 获取状态对应的操作按钮
  const getActionButton = (status: ConferenceStatus) => {
    switch (status) {
      case "ongoing":
        return (
          <button className="conference-item__action-button conference-item__action-button--primary">
            进入直播
          </button>
        );
      case "paused":
        return (
          <button className="conference-item__action-button conference-item__action-button--secondary">
            恢复直播
          </button>
        );
      case "upcoming":
        return (
          <button className="conference-item__action-button conference-item__action-button--primary">
            开始直播
          </button>
        );
      case "history":
        return null;
      default:
        return null;
    }
  };

  // 渲染会议项
  const renderConferenceItem = (
    item: ConferenceItem | Omit<ConferenceItem, "subItems" | "status">,
    isSubItem = false
  ) => {
    const isHistory = "status" in item && item.status === "history";
    const hasSubItems =
      "subItems" in item && item.subItems && item.subItems.length > 0;
    const isExpanded = "isExpanded" in item && item.isExpanded;
    const status = "status" in item ? item.status : "history";

    return (
      <>
        <div
          key={item.id}
          className={`conference-item ${
            isSubItem ? "conference-item--sub" : ""
          } ${!isSubItem ? getStatusClassName(status) : ""}`}
          style={{ paddingLeft: hasSubItems ? "40px" : "20px" }}
        >
          {!isSubItem && (
            <div className="conference-item__status-indicator"></div>
          )}

          <div className="conference-item__main">
            {!isSubItem && item.tags && item.tags.length > 0 && (
              <div className="conference-item__tags">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`conference-item__tag conference-item__tag--${tag.type}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
            <div className="conference-item__title">{item.title}</div>
            {(item.creators && item.creators.length > 0) ||
            (item.collaborators && item.collaborators.length > 0) ? (
              <div className="conference-item__participants">
                {item.creators && item.creators.length > 0 && (
                  <div className="conference-item__participant-group">
                    <span className="conference-item__participant-label">
                      创建者
                    </span>
                    <div className="conference-item__avatars">
                      {item.creators?.slice(0, 4).map((avatar, index) => (
                        <Avatar
                          className="conference-item__avatar"
                          key={index}
                          size={21}
                          icon={<UserOutlined />}
                        />
                      ))}
                      {item.creators && item.creators.length > 4 && (
                        <Avatar
                          className="conference-item__avatar"
                          size={21}
                          icon={<span>+{item.creators.length - 4}</span>}
                        />
                      )}
                    </div>
                  </div>
                )}
                {item.collaborators && item.collaborators.length > 0 && (
                  <div className="conference-item__participant-group">
                    <span className="conference-item__participant-label">
                      协作者
                    </span>
                    <div className="conference-item__avatars">
                      {item.collaborators?.slice(0, 4).map((avatar, index) => (
                        <Avatar
                          className="conference-item__avatar"
                          key={index}
                          size={21}
                          icon={<UserOutlined />}
                        />
                      ))}
                      {item.collaborators && item.collaborators.length > 4 && (
                        <Avatar
                          className="conference-item__avatar"
                          size={21}
                          icon={<span>+{item.collaborators.length - 4}</span>}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div
            className="conference-item__time"
            style={{ flexDirection: !isSubItem ? "column" : "row" }}
          >
            <div className="conference-item__time-item">{item.startTime}</div>
            {!isSubItem && !isHistory && (
              <div className="conference-item__time-separator">|</div>
            )}
            {isSubItem && !isHistory && <div>-</div>}
            {!isSubItem && !isHistory && (
              <div className="conference-item__time-item">{item.endTime}</div>
            )}
            {isSubItem && (
              <div className="conference-item__time-item">{item.endTime}</div>
            )}
          </div>
          <div className="conference-item__location">{item.location}</div>
          {item.operator && (
            <div className="conference-item__operator">{item.operator}</div>
          )}

          <div className="conference-item__actions">
            {!isSubItem && !isHistory && getActionButton(status)}
            <button className="conference-item__action-more">
              <MoreOutlined />
            </button>
          </div>

          {hasSubItems && (
            <div
              className="conference-item__expand-toggle"
              onClick={() => toggleHistoryExpand(item.id)}
            >
              {isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
            </div>
          )}
        </div>
      </>
    );
  };

  // 按状态分组渲染
  const renderConferencesByStatus = () => {
    const ongoingConferences = conferences.filter(
      (item) => item.status === "ongoing"
    );
    const pausedConferences = conferences.filter(
      (item) => item.status === "paused"
    );
    const upcomingConferences = conferences.filter(
      (item) => item.status === "upcoming"
    );
    const historyConferences = conferences.filter(
      (item) => item.status === "history"
    );

    return (
      <>
        {ongoingConferences.length > 0 && (
          <div className="conference-section">
            <div className="conference-section__title">进行中</div>
            <div className="conference-section__content">
              {ongoingConferences.map((item) => renderConferenceItem(item))}
            </div>
          </div>
        )}

        {pausedConferences.length > 0 && (
          <div className="conference-section">
            <div className="conference-section__title">暂停中</div>
            <div className="conference-section__content">
              {pausedConferences.map((item) => renderConferenceItem(item))}
            </div>
          </div>
        )}

        {upcomingConferences.length > 0 && (
          <div className="conference-section">
            <div className="conference-section__title">未开始</div>
            <div className="conference-section__content">
              {upcomingConferences.map((item) => renderConferenceItem(item))}
            </div>
          </div>
        )}

        {historyConferences.length > 0 && (
          <div className="conference-section">
            <div className="conference-section__title">历史数据</div>
            <div className="conference-section__content">
              {historyConferences.map((item) => (
                <div key={item.id} className="history-group">
                  {renderConferenceItem(item)}
                  {item.isExpanded &&
                    item.subItems &&
                    item.subItems.length > 0 && (
                      <div className="history-group__subitems">
                        <div
                          style={{ MozBorderRadiusTopleft: "0px" }}
                          className="conference-item__status-indicator"
                        ></div>
                        {item.subItems.map((subItem) =>
                          renderConferenceItem(subItem, true)
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="conference-page">
      <div className="conference-page__header">
        <div className="conference-page__header-content"></div>
      </div>
      <div className=".conference-page__body"></div>
      {/* 页面标题和搜索框 */}
      <div className="conference-page__content-header">
        <div className="content-header__title">我的座谈会（999）</div>
        <div className="content-header__search-box">
          <input
            type="text"
            placeholder="请输入关键词"
            className="content-header__search"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <SearchOutlined className="content-header__search-icon" />
        </div>
      </div>
      {/* 页面主体 */}
      <div className="conference-page__body">
        {/* 会议列表 */}
        <div className="conference-page__content-body">
          {renderConferencesByStatus()}
        </div>
      </div>
    </div>
  );
};

export default ConferencePage;
