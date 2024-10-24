import React from "react";
import {BrowserRouter, Routers, Routes, Route, Navigate} from  "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import CoordinatorTab from "./pages/coordinator/CoordinatorTab";
import UserList from "./pages/estaff/UserList";
import CreateUser from "./pages/estaff/CreateUser";
import EStaffDocumentsList from "./pages/estaff/EStaffDocumentsList";
import EstaffDashboard from "./pages/estaff/EstaffDashboard";
import EstaffViewDocument from "./pages/estaff/EstaffViewDocuments";
import ProjLeadDashboard from "./pages/projectlead/ProjLeadDashboard";
import ProjLeadRequirements from "./pages/projectlead/ProjLeadRequirements";
import ProjLeadAccReport from "./pages/projectlead/ProjLeadAccReport";
import ProjLeadCreateAccReport from "./pages/projectlead/ProjLeadCreateAccReport";
import ProjLeadDailyAttRec from "./pages/projectlead/ProjLeadDailyAttRec";
import ProjLeadEvalSum from "./pages/projectlead/ProjLeadEvalSum";
import ProjLeadTrainersCV from "./pages/projectlead/ProjLeadTrainersCV";
import ProjLeadLecNotes from "./pages/projectlead/ProjLeadLecNotes";
import ProjLeadOthers from "./pages/projectlead/ProjLeadOthers";
import Topbar from "./components/Topbar";
import DeptOffSideBar from './components/DeptOffSideBar';
import DeptOffDashboard from "./pages/deptoff/DeptOffDashboard";
import DeptOffGenerateDocument from "./pages/deptoff/DeptOffGenerateDocument";
import DeptOffProfilePage from "./pages/deptoff/DeptOffProfilePage";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";
import SignatoryDashboard from "./pages/signatory/SignatoryDashboard";
import EStaffProjects from "./pages/estaff/EStaffProjects";
import EStaffProjMonitoring from "./pages/estaff/EStaffProjMonitoring";
import ProponentsProjects from "./pages/proponents/ProponentsProjects"
import ProponentsProjReq from "./pages/proponents/ProponentsProjReq";
import ProponentsDailyAttRec from "./pages/proponents/ProponentsDailyAttRec";
import ProponentsLecNotes from "./pages/proponents/ProponentsLecNotes";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={ <LoginPage /> } />
      <Route path="/user" element={ <ProjLeadDashboard /> } />
      <Route path="/estaff" element={ <EstaffDashboard /> } />
      <Route path="/deptoff" element={ <DeptOffDashboard /> } />
      <Route path="/coordinator" element={ <CoordinatorDashboard /> } />
      <Route path="/signatory" element={ <SignatoryDashboard /> } />
      <Route path="/projlead/requirements" element={<ProjLeadRequirements />} />
      <Route path="/projlead/requirements/accomplishment-report" element={<ProjLeadAccReport />} />
      <Route path="/projlead/requirements/create-accomplishment-report" element={<ProjLeadCreateAccReport />} />
      <Route path="/projlead/requirements/daily-attendance" element={<ProjLeadDailyAttRec />} />
      <Route path="/projlead/requirements/evaluation-summary" element={<ProjLeadEvalSum />} />
      <Route path="/projlead/requirements/trainer-cv" element={<ProjLeadTrainersCV />} />
      <Route path="/projlead/requirements/modules-notes" element={<ProjLeadLecNotes />} />
      <Route path="/projlead/requirements/others" element={<ProjLeadOthers />} />
      <Route path="projects" element={<EStaffProjects />} />
      <Route path="projects/monitoring" element={<EStaffProjMonitoring />} />
      <Route path="/proponents/projects" element={<ProponentsProjects />} />
      <Route path="/proponents/projects/req" element={<ProponentsProjReq />} />
      <Route path="/proponents/projects/req/dtr" element={<ProponentsDailyAttRec/>} />
      <Route path="/proponents/projects/req/lecnotes" element={<ProponentsLecNotes/>} />

    </Routes>
  );
}

export default App;