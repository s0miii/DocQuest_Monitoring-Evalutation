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
import ProjLeadTrainersCV from "./pages/projectlead/ProjLeadTrainersCV";
import ProjLeadLecNotes from "./pages/projectlead/ProjLeadLecNotes";
import ProjLeadOthers from "./pages/projectlead/ProjLeadOthers";
// import Topbar from "./components/Topbar";
// import DeptOffSideBar from './components/DeptOffSideBar';
import DeptOffDashboard from "./pages/deptoff/DeptOffDashboard";
// import DeptOffGenerateDocument from "./pages/deptoff/DeptOffGenerateDocument";
// import DeptOffProfilePage from "./pages/deptoff/DeptOffProfilePage";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";
import SignatoryDashboard from "./pages/signatory/SignatoryDashboard";
import EStaffProjects from "./pages/estaff/EStaffProjects";
import EStaffProjMonitoring from "./pages/estaff/EStaffProjMonitoring";
import EstaffTrainerCVDTR from "./pages/estaff/EstaffTrainersCVDTR";
import EStaffOP1OP2 from "./pages/estaff/EStaffOP1OP2";
import ProponentsProjects from "./pages/proponents/ProponentsProjects"
import ProponentsProjReq from "./pages/proponents/ProponentsProjReq";
import ProponentsDailyAttRec from "./pages/proponents/ProponentsDailyAttRec";
import ProponentsEvalSum from "./pages/proponents/ProponentsEvalSum";
import ProponentsTrainerCVDTR from "./pages/proponents/ProponentsTrainerCVDTR";
import ProponentsLecNotes from "./pages/proponents/ProponentsLecNotes";
import ProponentsOther from "./pages/proponents/ProponentsOther";

import EvaluationForm from "./pages/proponents/EvaluationForm";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/user" element={<ProjLeadDashboard />} />
      <Route path="/estaff" element={<EstaffDashboard />} />
      <Route path="/estaff/prexc/op1-op2" element={<EStaffOP1OP2 />} />
      <Route path="/deptoff" element={<DeptOffDashboard />} />
      <Route path="/coordinator" element={<CoordinatorDashboard />} />
      <Route path="/signatory" element={<SignatoryDashboard />} />
      <Route path="/projlead/proj" element={<ProjLeadProjects />} />
      <Route path="/projlead/proj/req/:projectID" element={<ProjLeadProjReq />} />
      <Route path="/projlead/proj/req/assign-proponents" element={<ProjLeadAssignProponents />} />
      <Route path="/projlead/proj/req/accomplishment-report" element={<ProjLeadAccReport />} />
      <Route path="/projlead/proj/req/create-accomplishment-report" element={<ProjLeadCreateAccReport />} />
      <Route path="/projlead/proj/req/daily-attendance" element={<ProjLeadDailyAttRec />} />
      <Route path="/projlead/proj/req/evaluation-summary" element={<ProjLeadEvalSum />} />
      <Route path="/projlead/proj/req/trainer-cv-dtr" element={<ProjLeadTrainersCV />} />
      <Route path="/projlead/proj/req/modules-notes" element={<ProjLeadLecNotes />} />
      <Route path="/projlead/proj/req/others" element={<ProjLeadOthers />} />

      <Route path="estaff/proj" element={<EStaffProjects />} />
      <Route path="estaff/proj/monitoring" element={<EStaffProjMonitoring />} />
      <Route path="/estaff/proj/monitoring/trainer-cv-dtr" element={<EstaffTrainerCVDTR />} />

      <Route path="/proponents/projects" element={<ProponentsProjects />} />
      <Route path="/proponents/proj/req/:projectID" element={<ProponentsProjReq />} />
      <Route path="/proponents/project/:project_id/daily-attendance" element={<ProponentsDailyAttRec />} />
      <Route path="/proponents/proj/req/evaluation-summary" element={<ProponentsEvalSum />} />
      <Route path="/proponents/proj/req/trainer-cv-dtr" element={<ProponentsTrainerCVDTR />} />
      <Route path="/proponents/proj/req/modules-notes" element={<ProponentsLecNotes />} />
      <Route path="/proponents/proj/req/other" element={<ProponentsOther />} />
      <Route path="/eval" element={<EvaluationForm />} />
    </Routes>
  );
}

export default App;