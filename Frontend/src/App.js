import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
// import CoordinatorTab from "./pages/coordinator/CoordinatorTab";
// import UserList from "./pages/estaff/UserList";
// import CreateUser from "./pages/estaff/CreateUser";
// import EStaffDocumentsList from "./pages/estaff/EStaffDocumentsList";
import EstaffDashboard from "./pages/estaff/EstaffDashboard";
//import EstaffViewDocument from "./pages/estaff/EstaffViewDocuments";
import ProjLeadDashboard from "./pages/projectlead/ProjLeadDashboard";
import ProjLeadProjects from "./pages/projectlead/ProjLeadProjects";
import ProjLeadProjReq from "./pages/projectlead/ProjLeadProjReq";
import ProjLeadAssignProponents from "./pages/projectlead/ProjLeadAssignProponents";
import ProjLeadAccReport from "./pages/projectlead/ProjLeadAccReport";
import ProjLeadDailyAttRec from "./pages/projectlead/ProjLeadDailyAttRec";
import ProjLeadEvalSum from "./pages/projectlead/ProjLeadEvalSum";
import ProjLeadCvDtr from "./pages/projectlead/ProjLeadCvDtr";
import ProjLeadLecNotes from "./pages/projectlead/ProjLeadLecNotes";
import ProjLeadOthers from "./pages/projectlead/ProjLeadOthers";
import ProjLeadPhotoDocs from "./pages/projectlead/ProjLeadPhotoDocs";
// import Topbar from "./components/Topbar";
// import DeptOffSideBar from './components/DeptOffSideBar';
import DeptOffDashboard from "./pages/deptoff/DeptOffDashboard";
import DeptOffProjectsDashboard from "./pages/deptoff/DeptOffProjectsDashboard.js";

import CollegeDeanProjectsDashboard from "./pages/collegeDean/CollegeDeanProjectsDashboard.js";

// import DeptOffGenerateDocument from "./pages/deptoff/DeptOffGenerateDocument";
// import DeptOffProfilePage from "./pages/deptoff/DeptOffProfilePage";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";
import SignatoryDashboard from "./pages/signatory/SignatoryDashboard";
import StaffProjectsDashboard from "./pages/estaff/StaffProjectsDashboard";
import StaffDailyAttRec from "./pages/estaff/StaffDailyAttRec";
import StaffEvalSum from "./pages/estaff/StaffEvalSum.js";
import StaffCvDtr from "./pages/estaff/StaffCvDtr";
import StaffLecNotes from "./pages/estaff/StaffLecNotes";
import StaffPhotoDocs from "./pages/estaff/StaffPhotoDocs";
import StaffOthers from "./pages/estaff/StaffOthers";
import EStaffProjReq from "./pages/estaff/EStaffProjReq";
// import EstaffTrainerCVDTR from "./pages/estaff/EstaffTrainersCVDTR";
import EStaffOP1OP3 from "./pages/estaff/EStaffOP1OP3";
import EStaffOP2 from "./pages/estaff/EStaffOP2";
import EStaffOC from "./pages/estaff/EStaffOC";
import EStaffPREXC from "./pages/estaff/EStaffPREXC";
import ProponentsProjects from "./pages/proponents/ProjectsDashboard"
import ProponentsProjReq from "./pages/proponents/ProponentsProjReq";
import ProponentsDailyAttRec from "./pages/proponents/ProponentsDailyAttRec";
import ProponentsEvalSum from "./pages/proponents/ProponentsEvalSum";
import ProponentsCvDtr from "./pages/proponents/ProponentsCvDtr";
import ProponentsLecNotes from "./pages/proponents/ProponentsLecNotes";
import ProponentsOtherFiles from "./pages/proponents/ProponentsOtherFiles";
import ProponentsPhotoDocs from "./pages/proponents/ProponentsPhotoDocs";

import EvaluationForm from "./pages/attendance and evaluation/EvaluationForm";
import ProjectsDashboard from "./pages/proponents/ProjectsDashboard";

import FillAttendanceForm from "./pages/attendance and evaluation/FillAttendanceForm"
import AttendanceReport from "./pages/attendance and evaluation/AttendanceReport";
import { TrainerProjectDetails, EvaluationReport } from "./pages/attendance and evaluation/Trainer&EvaluationReport";


function App() {
      return (
            <Routes>
                  <Route path="/" element={<Navigate to="/login" />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/user" element={<ProjLeadDashboard />} />
                  <Route path="/coordinator" element={<CoordinatorDashboard />} />
                  <Route path="/signatory" element={<SignatoryDashboard />} />

                  <Route path="/deptoff" element={<DeptOffDashboard />} />
                  <Route path="/deptoff-projects-dashboard" element={<DeptOffProjectsDashboard />} />

                  <Route path="/collegedean-projects-dashboard" element={<CollegeDeanProjectsDashboard />} />

                  <Route path="/coordinator" element={<CoordinatorDashboard />} />

                  <Route path="/signatory" element={<SignatoryDashboard />} />

                  <Route path="/estaff" element={<EstaffDashboard />} />
                  <Route path="/estaff/prexc/op1-op3" element={<EStaffOP1OP3 />} />
                  <Route path="/estaff/prexc/op2" element={<EStaffOP2 />} />
                  <Route path="/estaff/prexc/oc" element={<EStaffOC />} />
                  <Route path="/estaff/prexc/performance" element={<EStaffPREXC />} />
                  {/* <Route path="/estaff/proj/monitoring/trainer-cv-dtr" element={<EstaffTrainerCVDTR />} /> */}
                  <Route path="/estaff/projreq/:projectID" element={<EStaffProjReq />} />
                  <Route path="/staff-projects-dashboard" element={<StaffProjectsDashboard />} />
                  <Route path="/staff/project/:projectID/daily-attendance" element={<StaffDailyAttRec />} />
                  <Route path="/staff/project/:projectID/summary-of-evaluation" element={<StaffEvalSum />} />
                  <Route path="/staff/project/:projectID/trainer-cv-dtr" element={<StaffCvDtr />} />
                  <Route path="/staff/project/:projectID/lecture-notes" element={<StaffLecNotes />} />
                  <Route path="/staff/project/:projectID/photo-documentations" element={<StaffPhotoDocs />} />
                  <Route path="/staff/project/:projectID/other-files" element={<StaffOthers />} />

                  <Route path="/projlead/proj" element={<ProjLeadProjects />} />
                  <Route path="/projlead/proj/req/:projectID" element={<ProjLeadProjReq />} />
                  <Route path="/projlead/assign-checklist/:projectID" element={<ProjLeadAssignProponents />} />
                  <Route path="/projlead/project/:projectID/accomplishment-report/:id" element={<ProjLeadAccReport />} />
                  <Route path="/projlead/project/:projectID/daily-attendance" element={<ProjLeadDailyAttRec />} />
                  <Route path="/projlead/project/:projectID/summary-of-evaluation" element={<ProjLeadEvalSum />} />
                  <Route path="/projlead/project/:projectID/trainer-cv-dtr" element={<ProjLeadCvDtr />} />
                  <Route path="/projlead/project/:projectID/lecture-notes" element={<ProjLeadLecNotes />} />
                  <Route path="/projlead/project/:projectID/other-files" element={<ProjLeadOthers />} />
                  <Route path="/projlead/project/:projectID/photo-documentations" element={<ProjLeadPhotoDocs />} />


                  <Route path="/projects-dashboard" element={<ProjectsDashboard />} />
                  <Route path="/proponents/proj/req/:projectID" element={<ProponentsProjReq />} />
                  <Route path="/proponents/project/:projectID/daily-attendance" element={<ProponentsDailyAttRec />} />
                  <Route path="/proponents/project/:projectID/summary-of-evaluation" element={<ProponentsEvalSum />} />
                  <Route path="/proponents/project/:projectID/trainer-cv-dtr" element={<ProponentsCvDtr />} />
                  <Route path="/proponents/project/:projectID/modules-notes" element={<ProponentsLecNotes />} />
                  <Route path="/proponents/project/:projectID/other" element={<ProponentsOtherFiles />} />
                  <Route path="/proponents/project/:projectID/photo-documentations" element={<ProponentsPhotoDocs />} />
                  
                  <Route path="/monitoring/evaluation/fill/:token" element={<EvaluationForm />} />
                  <Route path="/attendance/fill/:token" element={<FillAttendanceForm />} />
                  <Route path="/projlead/attendance-records/:templateId" element={<AttendanceReport />} />
                  <Route path="/trainer-project/:trainerID/:projectID" element={<TrainerProjectDetails />} />
                  <Route path="/evaluations/:trainerID/:projectID" element={<EvaluationReport />} />
            </Routes>
      );
}

export default App;