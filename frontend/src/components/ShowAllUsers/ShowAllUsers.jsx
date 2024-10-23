import React, { useState, useEffect } from "react";
import "./ShowAllUsers.scss";
import axios from "axios";
import { Space, Table, Tag, Spin } from "antd";

const ShowAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/user/all-users", { withCredentials: true });
        setUsers(response.data);
      } catch (error) {
        console.error("Error occurred:", error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      title: "שם",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
      showSorterTooltip: {
        target: "full-header",
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ת.ז.",
      dataIndex: "userId",
      key: "userId",
      showSorterTooltip: {
        target: "full-header",
      },
      sorter: (a, b) => a.userId - b.userId,
      sortDirections: ["descend", "ascend"],
      width: "10%",
    },
    {
      title: "תאריך הרשמה",
      dataIndex: "registerDate",
      key: "registerDate",
      showSorterTooltip: {
        target: "full-header",
      },
      sorter: (a, b) => new Date(a.registerDate) - new Date(b.registerDate),
      sortDirections: ["descend", "ascend"],
      width: "10%",
    },
    {
      title: "פרוייקט נבחר",
      dataIndex: "selectedProject",
      key: "selectedProject",
      showSorterTooltip: {
        target: "full-header",
      },
      sorter: (a, b) => a.selectedProject.localeCompare(b.selectedProject),
      sortDirections: ["descend", "ascend"],
      filters: [
        { text: "נבחר פרוייקט", value: "נבחר פרוייקט" },
        { text: "לא נבחר פרוייקט", value: "לא נבחר פרוייקט" },
      ],
      onFilter: (value, record) => {
        if (value === "נבחר פרוייקט") {
          return record.selectedProject !== "לא נבחר פרוייקט";
        }
        return record.selectedProject === "לא נבחר פרוייקט";
      },
    },
    {
      title: "תפקיד",
      key: "role",
      render: (_, record) => (
        <Space>
          {record.isStudent && <Tag color="blue">סטודנט</Tag>}
          {record.isAdvisor && <Tag color="green">מנחה</Tag>}
          {record.isCoordinator && <Tag color="purple">מנהל</Tag>}
        </Space>
      ),
      filters: [
        { text: "סטודנט", value: "סטודנט" },
        { text: "מנחה", value: "מנחה" },
        { text: "מנהל", value: "מנהל" },
      ],
      onFilter: (value, record) => {
        if (value === "סטודנט") {
          return record.isStudent;
        } else if (value === "מנחה") {
          return record.isAdvisor;
        } else if (value === "מנהל") {
          return record.isCoordinator;
        }
        return false;
      },
      width: "12%",
    },
    {
      title: "אימייל",
      dataIndex: "email",
      key: "email",
      showSorterTooltip: {
        target: "full-header",
      },
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["descend", "ascend"],
      width: "15%",
    },
    {
      title: "פעולות",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record.key)}>ערוך</a>
          <a onClick={() => handleDelete(record.key)}>מחק</a>
        </Space>
      ),
      width: "5%",
    },
  ];

  const handleEdit = (userId) => {
    console.log("Edit user:", userId);
  };

  const handleDelete = (userId) => {
    console.log("Delete user:", userId);
  };

  const dataSource = users.map((user) => ({
    key: user._id,
    name: user.name,
    userId: user.id,
    registerDate: new Date(user.registerDate).toLocaleDateString("he-IL"),
    selectedProject: user.selectedProject ? user.selectedProject.title : "לא נבחר פרוייקט",
    email: user.email,
    isStudent: user.isStudent,
    isAdvisor: user.isAdvisor,
    isCoordinator: user.isCoordinator,
  }));

  return (
    <div>
      <div className="active-users">
        <h2>משתמשים רשומים</h2>
        {loading && <Spin />}
        <Table columns={columns} dataSource={dataSource} />
      </div>
      <div className="watiting-users">
        <h2>מחכים להרשמה</h2>
      </div>
      <div className="banned-users">
        <h2>משתמשים חסומים</h2>
      </div>
    </div>
  );
};

export default ShowAllUsers;