import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  InfoCircleOutlined,
  BookOutlined,
  UserOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { Tooltip } from "antd";
import DataTable from "react-data-table-component";

import "./ProjectPage.scss";

const ProjectPage = () => {
  const { projectID } = useParams();
  const [projectData, setProjectData] = useState({});
  const [confirmSignup, setConfirmSignup] = useState(false);
  const [page, setPage] = useState({
    Information: true,
    Grades: false,
    Other: false
  });
  const [advisors, setAdvisors] = useState([]);

  useEffect(() => {
    const getAdvisorInfo = async () => {
      if (projectData.advisors) {
        try {
          if (projectData.advisors.length === 0) return;
          const advisors = [];
          for (const advisor of projectData.advisors) {
            const response = await axios.get(`http://localhost:5000/api/user/get-user-info/${advisor}`, {
              withCredentials: true
            });
            advisors.push(response.data);
            console.log(response.data);
          }
          setAdvisors(advisors);
        } catch (error) {
          console.error("Error occurred:", error);
        }
      }
    };
    getAdvisorInfo();
  }, [projectData]);

  const switchPage = (pageName) => {
    const myPages = { ...page };
    for (const key in page) {
      myPages[key] = key === pageName;
    }
    setPage(myPages);
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/project/get-project/${projectID}`, {
          withCredentials: true
        });
        setProjectData(response.data);
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };
    fetchProjectData();
  }, [projectID]);

  const copyToClipboard = () => {
    const emails = advisors.map((advisor) => advisor.email).join(", ");
    navigator.clipboard.writeText(emails);
  };

  // const columns = [
  //   {
  //     name: "שם הסטודנט",
  //     selector: (row) => row.name,
  //     sortable: true
  //   },
  //   {
  //     name: "תאריך הצטרפות",
  //     selector: (row) => row.date,
  //     sortable: true
  //   },
  //   {
  //     name: "פעולות",
  //     cell: row => (
  //       <div className="students-list-actions">
  //         <CheckCircleOutlined />
  //         <CloseCircleOutlined />
  //       </div>
  //     ),
  //     ignoreRowClick: true,  // Prevent row click event when clicking these buttons
  //     allowOverflow: true,    // Allow content to overflow the cell if necessary
  //     button: true,
  //   }
  // ];

  // // Sample data
  // const data = [
  //   {
  //     id: 1,
  //     name: "Tiger Nixon",
  //   },
  //   {
  //     id: 2,
  //     name: "Garrett Winters",
  //   }
  //   // Add more rows as needed
  // ];
  const Signup = async () => {
    console.log("Signup");
    setConfirmSignup(true);
  };

  return (
    <div className="project-container">
      {confirmSignup && (
        <div className="popup-overlay">
          <div className="confirm-registration">
            <h2>הרשמתך התקבלה</h2>
            <span className="confirm-info">
              שים לב שיש צורך ליצור קשר עם המרצה באופן אישי ע"י אימייל על מנת לקבל פרטים נוספים על הפרוייקט ולסכם הרשמה.
              לאחר מכן המרצה יוכל לאשר אותכם כחלק מהפרוייקט.
            </span>
            <span className="confirm-info">
              במידה ואתם נרשמים כזוג, על השותף לבצע הרשמה לחוד. בשליחה המייל למרצה יש לשים לב כי כל השותפים מתוייגים
              במייל (להוסיף ב CC במעמד הכתיבה)
            </span>
            <div className="confirm-button" onClick={() => setConfirmSignup(false)}>
              הנני מאשר את קריאת ההודעה
            </div>
          </div>
        </div>
      )}
      <div className="project-profile-header">
        <h2 className="project-title">{projectData.title}</h2>
      </div>
      <div className="project-advisors-list">
        {advisors.map((advisor, index) => (
          <div key={index} className="project-advisor">
            <UserOutlined />
            <div className="project-advisor-name">{advisor.name}</div>
          </div>
        ))}
      </div>
      <div className="project-profile-navbar">
        <div
          className={`project-navbar-item ${page.Information ? "navbar-item-selected" : ""}`}
          onClick={() => switchPage("Information")}>
          <InfoCircleOutlined />
          <div className="project-navbar-item-name">פרטי הפרוייקט</div>
        </div>
        <div
          className={`project-navbar-item ${page.Grades ? "navbar-item-selected" : ""}`}
          onClick={() => switchPage("Grades")}>
          <BookOutlined />
          <div className="project-navbar-item-name">ציונים</div>
        </div>
        <div
          className={`project-navbar-item ${page.Other ? "navbar-item-selected" : ""}`}
          onClick={() => switchPage("Other")}>
          <div className="project-navbar-item-icon"></div>
          <div className="project-navbar-item-name">לא יודע עוד משהו</div>
        </div>
      </div>
      <hr className="project-profile-line"></hr>
      {page.Information && (
        <div className="project-profile-info project-profile-content">
          <div className="project-profile-info-item">
            <div className="project-profile-info-title">תיאור הפרוייקט</div>
            <div className="project-profile-info-text">{projectData.description}</div>
          </div>
          <div className="project-profile-info-item project-badges">
            <div className="project-profile-info-title">התאמות:</div>
            <Tooltip title="מתאים ל">
              <div className="project-badge project-suitable">{projectData.suitableFor}</div>
            </Tooltip>
            <Tooltip title="סוג פרוייקט">
              <div className="project-badge project-type">{projectData.type}</div>
            </Tooltip>
          </div>
          <div className="project-profile-info-item project-profile-info-emails">
            <div className="project-profile-info-title">אימייל המרצה ליצירת קשר:</div>
            <div className="project-profile-info-text project-profile-info-email">
              {advisors.map((advisor, index) => (
                <Tooltip key={index} title="לחץ להעתקה">
                  <div
                    className="advisor-email"
                    onClick={() => {
                      copyToClipboard();
                    }}>
                    {advisor.email}
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
          <div className="project-signup-button" onClick={() => Signup()}>
            הרשמה לפרוייקט
          </div>
          {/* <div className="project-profile-info-item">
            <div className="project-profile-info-title">רשימת המתנה:</div>
            <DataTable columns={columns} data={data} highlightOnHover />
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
