import React from "react";
import { BrowserRouter, Routers, Routes, Route, Navigate } from "react-router-dom";
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
import ProjLeadCreateAccReport from "./pages/projectlead/ProjLeadCreateAccReport";
import ProjLeadDailyAttRec from "./pages/projectlead/ProjLeadDailyAttRec";
import ProjLeadEvalSum from "./pages/projectlead/ProjLeadEvalSum";
import ProjLeadCvDtr from "./pages/projectlead/ProjLeadCvDtr";
import ProjLeadLecNotes from "./pages/projectlead/ProjLeadLecNotes";
import ProjLeadOthers from "./pages/projectlead/ProjLeadOthers";
import ProjLeadPhotoDocs from "./pages/projectlead/ProjLeadPhotoDocs";
// import Topbar from "./components/Topbar";
// import DeptOffSideBar from './components/DeptOffSideBar';
import DeptOffDashboard from "./pages/deptoff/DeptOffDashboard";
// import DeptOffGenerateDocument from "./pages/deptoff/DeptOffGenerateDocument";
// import DeptOffProfilePage from "./pages/deptoff/DeptOffProfilePage";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";
import SignatoryDashboard from "./pages/signatory/SignatoryDashboard";
import StaffProjectsDashboard from "./pages/estaff/StaffProjectsDashboard";
import StaffDailyAttRec from "./pages/estaff/StaffDailyAttRec";
import StaffCvDtr from "./pages/estaff/StaffCvDtr";
import StaffLecNotes from "./pages/estaff/StaffLecNotes";
import StaffPhotoDocs from "./pages/estaff/StaffPhotoDocs";
import StaffOthers from "./pages/estaff/StaffOthers";
import EStaffProjReq from "./pages/estaff/EStaffProjReq";
import EStaffOP1OP2 from "./pages/estaff/EStaffOP1OP2";
import ProponentsProjects from "./pages/proponents/ProjectsDashboard"
import ProponentsProjReq from "./pages/proponents/ProponentsProjReq";
import ProponentsDailyAttRec from "./pages/proponents/ProponentsDailyAttRec";
import ProponentsEvalSum from "./pages/proponents/ProponentsEvalSum";
import ProponentsCvDtr from "./pages/proponents/ProponentsCvDtr";
import ProponentsLecNotes from "./pages/proponents/ProponentsLecNotes";
import ProponentsOtherFiles from "./pages/proponents/ProponentsOtherFiles";
import ProponentsPhotoDocs from "./pages/proponents/ProponentsPhotoDocs";

import EvaluationForm from "./pages/proponents/EvaluationForm";
import ProjectsDashboard from "./pages/proponents/ProjectsDashboard";





function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/user" element={<ProjLeadDashboard />} />
      <Route path="/deptoff" element={<DeptOffDashboard />} />
      <Route path="/coordinator" element={<CoordinatorDashboard />} />
      <Route path="/signatory" element={<SignatoryDashboard />} />

      <Route path="/estaff" element={<EstaffDashboard />} />
      <Route path="/estaff/prexc/op1-op2" element={<EStaffOP1OP2 />} />
      <Route path="/estaff/projreq/:projectID" element={<EStaffProjReq />} />
      <Route path="/staff-projects-dashboard" element={<StaffProjectsDashboard />} />
      <Route path="/staff/project/:projectID/daily-attendance" element={<StaffDailyAttRec />} />
      <Route path="/staff/project/:projectID/trainer-cv-dtr" element={<StaffCvDtr />} />
      <Route path="/staff/project/:projectID/lecture-notes" element={<StaffLecNotes />} />
      <Route path="/staff/project/:projectID/photo-documentations" element={<StaffPhotoDocs />} />
      <Route path="/staff/project/:projectID/other-files" element={<StaffOthers />} />


      <Route path="/projlead/proj" element={<ProjLeadProjects />} />
      <Route path="/projlead/proj/req/:projectID" element={<ProjLeadProjReq />} />
      <Route path="/projlead/assign-checklist/:projectID" element={<ProjLeadAssignProponents />} />
      <Route path="/projlead/proj/req/accomplishment-report" element={<ProjLeadAccReport />} />
      <Route path="/projlead/project/:projectID/create-accomplishment-report" element={<ProjLeadCreateAccReport />} />
      <Route path="/projlead/project/:projectID/daily-attendance" element={<ProjLeadDailyAttRec />} />
      <Route path="/projlead/project/:projectID/evaluation-summary" element={<ProjLeadEvalSum />} />
      <Route path="/projlead/project/:projectID/trainer-cv-dtr" element={<ProjLeadCvDtr />} />
      <Route path="/projlead/project/:projectID/lecture-notes" element={<ProjLeadLecNotes />} />
      <Route path="/projlead/project/:projectID/other-files" element={<ProjLeadOthers />} />
      <Route path="/projlead/project/:projectID/photo-documentations" element={<ProjLeadPhotoDocs />} />



      <Route path="/projects-dashboard" element={<ProjectsDashboard />} />
      <Route path="/proponents/proj/req/:projectID" element={<ProponentsProjReq />} />
      <Route path="/proponents/project/:projectID/daily-attendance" element={<ProponentsDailyAttRec />} />
      <Route path="/proponents/project/:projectID/evaluation-summary" element={<ProponentsEvalSum />} />
      <Route path="/proponents/project/:projectID/trainer-cv-dtr" element={<ProponentsCvDtr />} />
      <Route path="/proponents/project/:projectID/modules-notes" element={<ProponentsLecNotes />} />
      <Route path="/proponents/project/:projectID/other" element={<ProponentsOtherFiles />} />
      <Route path="/proponents/project/:projectID/photo-documentations" element={<ProponentsPhotoDocs />} />
      <Route path="/eval" element={<EvaluationForm />} />
    </Routes>

  );
}

export default App;