import React, { useEffect, useState } from "react";
import { Badge, Table, Tooltip, Switch } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, UserDeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "./ManageProjects.scss";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/project/get-self-projects/`, {
          withCredentials: true
        });

        // Assuming `project.candidates` contains the array of student objects
        const projectData = response.data.projects.map((project) => ({
          key: project._id, // Assuming there's an `_id` field
          title: project.title,
          isApproved: project.isApproved ? (
            <Badge status="success" text="מאושר" />
          ) : (
            <Badge status="error" text="לא מאושר" />
          ),
          isTaken: project.isTaken,
          candidates: project.candidates, // candidates should be an array of student objects
          students: project.students, // Assuming `project.students` contains the array of student objects
          registered: project.students.length + project.candidates.length,
          projectInfo: project
        }));

        projectData.forEach(async (project) => {
          project.candidatesData = [];
          project.students.forEach(async (student) => {
            const studentResponse = await axios.get(`http://localhost:5000/api/user/get-user-info/${student}`, {
              withCredentials: true
            });
            project.candidatesData.push({
              key: student,
              name: studentResponse.data.name,
              date: new Date().toLocaleString("he-IL"),
              status: true,
              candidateInfo: studentResponse.data,
              projectID: project._id
            });
          });

          project.candidates.forEach(async (candidate) => {
            const studentResponse = await axios.get(
              `http://localhost:5000/api/user/get-user-info/${candidate.student}`,
              {
                withCredentials: true
              }
            );
            project.candidatesData.push({
              key: candidate.student,
              name: studentResponse.data.name,
              date: candidate.joinDate,
              status: false,
              candidateInfo: studentResponse.data,
              projectID: project.projectInfo._id
            });
          });
        });

        setProjects(projectData);
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };
    fetchData();
  }, []);

  const closeRegistration = (record) => async () => {
    console.log(record);
    console.log("SWITCH!");
  };

  const approveStudent = (record) => async () => {
    console.log("APPROVE!", record.candidateInfo);
    console.log(record);
  };

  const declineStudent = (record) => async () => {
    console.log("DECLINE!", record.candidateInfo);
    console.log(record.projectID);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/project/remove-candidate`,
        {
          projectID: record.projectID,
          userID: record.candidateInfo._id
        },
        {
          withCredentials: true
        }
      );
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.key === record.projectID) {
            return {
              ...project,
              candidatesData: project.candidatesData.filter((candidate) => candidate.key !== record.candidateInfo._id) // Remove the declined candidate
            };
          }
          return project;
        })
      );
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const removeStudent = (record) => async () => {
    console.log(record);
  };

  const columns = [
    {
      title: "שם הפרוייקט",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "סטטוס אישור",
      dataIndex: "isApproved",
      key: "isApproved"
    },
    {
      title: "מספר רשומים",
      dataIndex: "registered",
      key: "registered",
      render: (registered) => registered // Display the number of candidates
    },
    {
      title: "פעולות",
      key: "action",
      render: (record) => (
        <span>
          <Switch
            checkedChildren="הרשמה פתוחה"
            unCheckedChildren="הרשמה סגורה"
            checked={!record.isTaken}
            onChange={closeRegistration(record)}
          />
        </span>
      )
    }
  ];

  const expandedRender = (record) => {
    const expandColumns = [
      {
        title: "שם הסטודנט",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "תאריך רישום",
        dataIndex: "date",
        key: "date",
        render: (date) => new Date(date).toLocaleString("he-IL") // Display the date in
      },
      {
        title: "סטטוס",
        dataIndex: "status",
        key: "status",
        render: (status) =>
          status ? <Badge status="success" text="מאושר" /> : <Badge status="error" text="לא מאושר" />
      },
      {
        title: "פעולה",
        key: "action",
        width: 250,
        render: (record) =>
          record.status ? (
            <div className="approve-decline-student">
              <Tooltip title="הסר סטודנט מפרוייקט">
                <UserDeleteOutlined onClick={removeStudent(record)} />
              </Tooltip>
            </div>
          ) : (
            <div className="approve-decline-student">
              <Tooltip title="אשר רישום לסטודנט זה">
                <CheckCircleOutlined onClick={approveStudent(record)} />
              </Tooltip>
              <Tooltip title="דחה רישום לסטודנט זה">
                <CloseCircleOutlined onClick={declineStudent(record)} />
              </Tooltip>
            </div>
          )
      }
    ];
    return <Table columns={expandColumns} dataSource={record.candidatesData} pagination={false} />;
  };

  return (
    <div>
      <Table columns={columns} dataSource={projects} expandable={{ expandedRowRender: expandedRender }} />
    </div>
  );
};

export default ManageProjects;
