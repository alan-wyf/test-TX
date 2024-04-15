import "./Header.css";
import { useNavigate } from "react-router-dom";
import { PoweroffOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

export default function Header() {
  const navigate = useNavigate();
  const handleLoginOut = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };
  return (
    <div className="header-warp">
      <div className="header-title">车展搭建商资质审核</div>
      <div className="login-out-btn" onClick={handleLoginOut}>
        {/* 退出登录 */}

        <Tooltip placement="bottom" title={"退出登录"}>
          <PoweroffOutlined />
        </Tooltip>
      </div>
    </div>
  );
}
