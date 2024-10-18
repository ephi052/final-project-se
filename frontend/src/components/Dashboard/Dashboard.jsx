import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
  HomeOutlined,
  ProjectOutlined,
  FileSearchOutlined,
  UsergroupAddOutlined,
  ApartmentOutlined,
  SelectOutlined,
  UnorderedListOutlined,
  LoginOutlined,
  SettingOutlined,
  FundProjectionScreenOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [privileges, setPrivileges] = useState({ isStudent: false, isAdvisor: false, isCoordinator: false });
  useEffect(() => {
    // Fetch data from the API
    const fetchPrivileges = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/privileges", { withCredentials: true });
        setPrivileges(response.data);
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };
    fetchPrivileges();
  }, []);

  const { Header, Content, Sider } = Layout;
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const items = [
    getItem("פרופיל", "0", <UserOutlined />),
    getItem("בית", "1", <HomeOutlined />),
    privileges.isStudent && getItem("פרוייקטים", "2", <ProjectOutlined />),
    privileges.isStudent &&
      getItem("תבנית דוחות", "sub1", <FileSearchOutlined />, [
        getItem("דוח אלפא", "3"),
        getItem("דוח בטא", "4"),
        getItem("דוח סופי", "5"),
      ]),
    privileges.isStudent &&
      getItem("הפרוייקט שלי", "sub2", <ApartmentOutlined />, [
        getItem("דף הפרוייקט", "6"),
        getItem("הצגת קבצים", "7"),
        getItem("הגשות", "8"),
        getItem("הערות מנחה", "9"),
        getItem("הערות שופט", "10"),
        getItem("צפייה בציון", "11"),
      ]),
    privileges.isStudent && getItem("הגשות", "12", <FileOutlined />),
    privileges.isAdvisor &&
      getItem("פרוייקטים שלי", "sub3", <FundProjectionScreenOutlined />, [
        getItem("הזנת פרוייקט", "13"),
        getItem("סטטוס פרוייקטים", "14"),
        getItem("סטטוס הגשות", "15"),
      ]),
    privileges.isCoordinator &&
      getItem("ניהול פרוייקטים", "sub4", <FundProjectionScreenOutlined />, [
        getItem("הזנת פרוייקט", "16"),
        getItem("הצגת פרוייקטים", "17"),
      ]),
    privileges.isCoordinator &&
      getItem("ניהול משתמשים", "sub5", <FundProjectionScreenOutlined />, [
        getItem("הזנת סטודנטים", "18"),
        getItem("הזנת משתמש צוות", "19"),
        getItem("עדכון הרשאות", "20"),
        getItem("הצגת משתמשים", "21"),
      ]),
    privileges.isCoordinator && getItem("ניהול מערכת", "22", <SettingOutlined />),
  ];

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogOut = async () => {
    try {
      await axios.post("http://localhost:5000/api/user/logout", { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div>
      <Layout
        style={{
          minHeight: "100vh",
          maxHeight: "100vh",
        }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          />
          <div className="site-upper-header">
            <h1>מערכת ניהול פרוייקטים</h1>
          </div>
          <LoginOutlined className="logout-icon" onClick={handleLogOut} />
          <Content
            style={{
              margin: "16px 16px 0 16px",
            }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}>
              כאן יהיה התוכן
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashboard;
