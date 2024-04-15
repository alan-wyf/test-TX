import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './style/comm.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider, Empty } from 'antd';
import noDataTab from './image/no-data.png'
// 设置中文
import dayjs from 'dayjs';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh');

const tableEmptyRender = () => {
  return <Empty
    image={noDataTab}
    description={<span style={{ color: '#727272' }}>暂无数据</span>}
  ></Empty>
}

const theme = {
  token: {
    fontFamily: '苹方',
    borderRadius: 8,
    colorError: '#DF000E',
    colorErrorBg: '#FBE5E6',
    colorInfo: '#4247F6',
    colorInfoBg: '#ECECFE',
    colorPrimary: '#4247F6',
    colorPrimaryHover: '#3D42D1',
    colorPrimaryActive: '#4247F6',
    colorPrimaryBg: '#ECECFE',
    colorSuccess: '#00AB7C',
    colorSuccessBg: '#E5F6F1',
    colorWarning: '#EB981A',
    colorWarningBg: '#FDF4E8',
    controlHeight: 36,
    colorText: '#262626',
    colorTextQuaternary: '#BBBBBB',
    colorTextSecondary: '#727272',
    colorTextTertiary: '#BBBBBB',
    colorBorder: '#EDEDED',
    shortMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  components: {
    Menu: {
      subMenuItemBg: '#FFFFFF',
      itemHeight: 48,
      itemMarginInline: 24,
      iconMarginInlineEnd: 13,
      itemBg: 'transparent',
      itemPaddingInline: 30,
      itemColor: '#727272',
      horizontalItemSelectedColor: '#4247F6',
      horizontalItemHoverColor: '#3D42D1'
    },
    Tabs: {
      horizontalItemPadding: "0 0 16px 0",
      titleFontSize: 18,
      itemColor: "#646A73",
    },
    message: {
      fontSize: 16,
      colorText: '#222222',
      contentBg: ''
    },
    Modal: {
      titleColor: '#222222',
    },
    Breadcrumb: {
      itemColor: '#262626',
      lastItemColor: '#262626',
      linkColor: '#262626',
      linkHoverColor: '#262626',
      colorBgTextHover: 'transparent',
    },
    Button: {
      defaultShadow: 'none',
      primaryShadow: 'none',
      dangerShadow: 'none'
    },
    Table: {
      headerBg: "rgba(66, 71, 246, 0.06)",
      headerSplitColor: "rgba(66, 71, 246, 0.06)",
      headerBorderRadius: 8,
      headerColor: "#1F2329 ",
    },
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={theme} renderEmpty={tableEmptyRender}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

reportWebVitals();
